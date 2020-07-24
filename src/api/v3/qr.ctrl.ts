import { RequestHandler } from "express";
import { generateRandomString } from "../../lib/passwordManager";
import User from "../../models/user";
import * as HTTP from "http-status-codes";
import { isSameDay } from "date-fns";
import Token from "../../models/token";
import { io } from "../.."; //TODO: 이딴 구조가 어딨어.

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

    io.emit("message", { msg: "OK", token });

    // io.emit("message", { msg: "hello" });
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

    const oldToken = await Token.find({}).exec();

    let msg: string = "token not found. just publish new token";

    // 유효한 token 이라면 기존의 token을 삭제한다.
    if (oldToken != null) {
      console.log(`--delete previous token:${dto.token}`);
      for (const item of oldToken) {
        await item.deleteOne();
      }
    }
    msg = "refresh token";

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
      { lastChecked: new Date(), temperature }
    ).exec();

    console.log(`${user.lastChecked}`);

    return res.status(HTTP.OK).json({ msg: `${user.lastChecked} 출석완료` });
  } catch (error) {
    console.error(`check Error`);
    console.error(error);
    return res.status(500).json({ msg: "Internal Error" });
  }
};

export const refreshTokenByToken = async (token: string) => {
  console.log(`refreshToken start:${token}`);

  const oldToken = await Token.find({}).exec();

  let msg: string = "token not found. just publish new token";

  // 유효한 token 이라면 기존의 token을 삭제한다.
  if (oldToken != null) {
    console.log(`--delete previous token:${token}`);
    for (const item of oldToken) {
      await item.deleteOne();
    }
  }
  msg = "refresh token";

  // token 값을 random으로 생성 후 저장
  const newToken = generateRandomString(64);
  const newTokenDao = new Token({ token, date: new Date() });
  let saveToken = await newTokenDao.save();
  console.log(`--save new token${saveToken}`);

  return { msg: "OK", token: newToken };
};
