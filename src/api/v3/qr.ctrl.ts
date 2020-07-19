import { Request, RequestHandler } from "express";
import QrRecord from "../../models/qrRecord";
import { generateRandomString } from "../../lib/passwordManager";
import User from "../../models/user";
import * as HTTP from "http-status-codes";
import { endOfDay, isSameDay, startOfDay } from "date-fns";
import { isValidObjectId } from "mongoose";
const userFilter = { __v: 0 };

//
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

// 유저가 email과 본인의 _id를 주면 token을 랜덤으로 생성해서 서버에 저장해놓자..
// 그리고 반환으로 유저에게 그 token값을 준다.
// 그러면 user는 그 토큰값을 이용해 QR 코드를 생성할 수 있다.
export const getToken: RequestHandler = async (req, res, next) => {
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
    // if (isSameDay(requestUser.lastChecked, new Date())) {
    //   // 오늘 이미 출석체크한 경우
    //   return res.status(HTTP.OK).json({ msg: "Already Checked" });
    // }

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
