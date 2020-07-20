import { Request, RequestHandler } from "express";
import QrRecord from "../../models/qrRecord";
import { generateRandomString } from "../../lib/passwordManager";
import User from "../../models/user";
import * as HTTP from "http-status-codes";
import { endOfDay, isSameDay, startOfDay } from "date-fns";
import { isValidObjectId } from "mongoose";
import Token from "../../models/token";
const userFilter = { __v: 0 };

/**
 * @typedef defaultResponse
 * @property {String} msg - 메세지
 */

/**
 * 출석체크를 한다.(관리자용)
 *
 * **요청**
 * ```
 * req.query.token - 출석에 필요한 token String
 * ```
 * **응답**
 * ```
 * 200 - {msg: '출석완료: (출석날짜)'}
 * 404 - {msg: '존재하지 않는 token'}
 * 500 - {msg: 'Internal Error'} // 서버 에러.
 * ```
 */
export const checkToken: RequestHandler = async (req, res, next) => {
  try {
    const dto = {
      token: req.query.token as string, // joi를 써서 검증을 하면 이런 과정이 적을텐데.
    };

    console.log(`get Key Value:${dto.token}`);
    const oldToken = await QrRecord.findOne({ token: dto.token }).exec();

    // 유효한 token 이라면 기존의 token을 삭제한다.
    if (oldToken != null) {
      const user = await User.findByIdAndUpdate(oldToken.userId, {
        lastChecked: new Date(),
      }).exec();
      const result = await oldToken.deleteOne();
      console.log("result: " + JSON.stringify(result));
      console.log(`currentTime:${new Date().toUTCString()}`);
      return res
        .status(HTTP.OK)
        .json({ msg: `출석완료: ${user.lastChecked.toUTCString()}` });
    } else {
      // 유효한 token이 아님.
      console.log("result: " + JSON.stringify(dto));
      return res.status(HTTP.NOT_FOUND).json({ msg: `존재하지 않는 token` });
    }
  } catch (error) {
    console.error("checkKey Error");
    console.error(error);
    return res.status(500).json({ msg: "Internal Error", error: true });
  }
};

/**
 * 출석체크에 필요한 Token을 반환한다.(학생용)
 *
 * ### 요청
 * ```
 * req.body._id - user의 _id값. DB의 _id임
 * ```
 *
 * ### 응답
 * ```
 * 400 - {msg:'유효하지 않은 ID입니다.'} // _id값이 ObjectId의 형태가 아닐 때
 * 400 - {msg:'존재하지 않는 ID입니다.'} // _id값으로 user가 조회되지 않을 때
 * 409 - {msg:'Already Checked'} // 해당 _id값이 이미 출석체크가 완료됐을 때
 * 200 - {msg: "duplicated resource", token: string} // 이미 token이 발행됐을 때
 * 200 - {token: string} // 정상적으로 토큰이 발행됐을 때
 * 500 - {msg: 'Internal Error'} // 서버 에러
 * ```
 *
 */
export const getToken: RequestHandler = async (req, res, next) => {
  // 유저가 email과 본인의 _id를 주면 token을 랜덤으로 생성해서 서버에 저장해놓자..
  // 그리고 반환으로 유저에게 그 token값을 준다.
  // 그러면 user는 그 토큰값을 이용해 QR 코드를 생성할 수 있다.
  try {
    // 요청된 id와 random String(token)을 QrRecrod에 저장함.
    const dto = {
      _id: req.body._id as string,
    };
    console.log(`getToken Start, _id:${dto._id}`);
    // QrRecord는 token과 userId값, Date를 갖고 있어야함.
    // 그래야 언제 요청된 token인지, 누가 요청한 token인지 알 수 있음.

    // 아예 잘못된 형태의 _id값일 경우, 400 상태값 반환.
    if (!isValidObjectId(dto._id)) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ msg: "유효하지 않는 ID입니다." });
    }

    // token 값을 random으로 생성
    const token = generateRandomString(64);

    // 요청을 준 user가 실제로 존재하는 사용자인지 확인
    // 만약 실제로 존재하지 않으면 잘못된 요청(400)이라고 반환.
    const requestUser = await User.findOne({ _id: dto._id }).exec();
    if (requestUser == null) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ msg: "존재하지 않는 ID입니다." });
    }

    // TODO: 테스트 끝나면 주석 지워주기.
    if (isSameDay(requestUser.lastChecked, new Date())) {
      // 오늘 이미 출석체크한 경우
      return res.status(HTTP.CONFLICT).json({ msg: "Already Checked" });
    }

    // 오늘 이미 요청했었던 사용자라면(token이 존재한다면) 그 token값을 그대로 반환해버림.
    const oldToken = await QrRecord.findOne({
      userId: dto._id,
      date: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) },
    });

    if (oldToken != null) {
      return res
        .status(HTTP.OK)
        .json({ msg: "duplicated resource", token: oldToken.token });
    }

    // token을 qrRecord에 저장하고 반환한다.
    const qrRecord = await QrRecord.create({
      userId: dto._id,
      token: token,
      date: new Date(),
    });

    return res.status(HTTP.OK).json({ token });
  } catch (error) {
    console.error("getToken Error");
    console.error(error);
    return res.status(500).json({ msg: "Internal Error", error: true });
  }
};

export const scanQr: RequestHandler = async (req, res, next) => {
  try {
    const token = req.query.token as string;
    if (token == null) {
      // 유효하지 않은 token입니다.
      console.log("Invalid Input: " + token);
      console.log("query:" + JSON.stringify(req.query));
      console.log("params:" + JSON.stringify(req.params));
      return res.status(HTTP.BAD_REQUEST).json({ msg: `Invalid Input` });
    }

    const oldToken = await Token.findOne({ token }).exec();
    if (oldToken == null) {
      console.log("Token not exists: " + token);
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ msg: `존재하지 않은 Token 입니다.` });
    }
    const result = await oldToken.deleteOne();
    const currentTime = new Date().toUTCString;
    console.log(`currentTime:${currentTime}`);
    return res.status(HTTP.OK).json({ msg: `${currentTime}` });
  } catch (error) {
    console.error(`scanQr Error`);
    console.error(error);
    return res.status(500).json({ msg: "Internal Error" });
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const dto = {
      token: req.query.token as string,
    };
    console.log(`refreshToken start:${dto.token}`);

    const oldToken = await Token.findOne({ token: dto.token }).exec();

    let msg: string = "refresh token";
    // 유효한 token 이라면 기존의 token을 삭제한다.
    if (oldToken != null) {
      console.log(`--delete previous token:${dto.token}`);
      await oldToken.deleteOne();
      msg = "token not found. just publish new token";
    }

    // token 값을 random으로 생성 후 저장
    const token = generateRandomString(64);
    const newToken = new Token({ token, date: new Date() });
    let saveToken = await newToken.save();
    console.log(`--save new token${saveToken}`);

    return res.status(HTTP.OK).json({ msg: msg, token });
  } catch (error) {
    console.error("checkKey Error");
    console.error(error);
    return res.status(500).json({ msg: "Internal Error", error: true });
  }
};

export const check: RequestHandler = async (req, res, next) => {
  try {
    const temperature = req.body.temperature as string;
    const email = req.body.email as string;
    const requestUser = await User.findOne({ email }).exec();
    if (requestUser == null) {
      return res.status(HTTP.BAD_REQUEST).json({ msg: "Email doesn't exist" });
    }

    if (isSameDay(requestUser.lastChecked, new Date())) {
      // 오늘 이미 출석체크한 경우
      return res.status(HTTP.CONFLICT).json({ msg: "Already Checked" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { lastChecked: new Date() }
    ).exec();

		console.log(`${user.lastChecked}`);

    return res
      .status(HTTP.OK)
      .json({ msg: `${user.lastChecked} 출석완료` });
  } catch (error) {
    console.error(`check Error`);
    console.error(error);
    return res.status(500).json({ msg: "Internal Error" });
  }
};
