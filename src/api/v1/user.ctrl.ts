import { RequestHandler } from "express";
import User from "../../models/user";
import FbUser from "../../models/fbUser";

export const signup = async (req, res, next) => {
  try {
    //TODO: input value validation
    const signupDTO = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const oldUser = await User.findOne({ email: signupDTO.email }).exec();
    if (oldUser == null) {
      const newUser = new User(signupDTO);
      const result = await newUser.save();
      console.log(`new User ${JSON.stringify(result)} saved.`);
      return res.status(200).send(); //
    } else {
      return res.status(400).send(); // json으로 해서 이미 존재한다고 msg 보내기 //HTTP status code
    }
  } catch (error) {
    console.error("signupError");
    console.error(error);
    return res.status(500).send();
  }
};

export const login = async (req, res, next) => {
  try {
    const loginDTO = {
      email: req.body.email,
      password: req.body.password,
    };
    const isExist = await User.findOne(loginDTO);
    if (isExist == null) {
      console.log("없는 아이디에 대한 요청");
      return res.status(404).json({ msg: "없는 아이디에 대한 요청" });
    } else {
      return res.status(200).json({ name: isExist.name, email: isExist.email });
    }
  } catch (error) {
    console.error("login Error");
    console.error(error);
    return res.status(500).send();
  }
};

export const fbLogin: RequestHandler = async (req, res, next) => {
  try {
    const fbLoginDTO = {
      email: req.body.email,
      name: req.body.name,
      id: req.body.id,
    };
    if (fbLoginDTO.id !== "123123") {
      // strict comparison이 필요할까?
      return res.status(404).json({ msg: "Not Authorized", error: true });
    } else {
      console.log("TEST login Success!!!");
      console.log(`VALUE: ${fbLoginDTO.id}`);
      const fbUser = await FbUser.findOne({ id: "123123" }).exec();
      return res.status(200).json({ msg: "OK", error: false, user: fbUser });
    }
  } catch (error) {
    console.error("FBLogin Error");
    console.error(error);
    return res.status(500).json({ msg: "에러발생", error: false });
  }
};

export const test: RequestHandler = async (req, res, next) => {
  try {
    const testLoginDTO = {
      data: req.body.name,
    };
    if (testLoginDTO.data === "park") {
      return res.status(400).json({ msg: "Not Park!" });
    } else {
      console.log("TEST login Success!!!");
      console.log(`VALUE: ${testLoginDTO.data}`);
      return res.status(200).json({ msg: `반환:${testLoginDTO.data}` });
    }
  } catch (error) {
    console.error("testLogin Error");
    console.error(error);
    return res.status(500).json({ msg: "에러발생" });
  }
};

export const testLogin: RequestHandler = async (req, res, next) => {
  try {
    const testLoginDTO = {
      id: req.body.id,
    };
    if (testLoginDTO.id !== "123123") {
      return res.status(400).json({ msg: "Not Authorized" });
    } else {
      console.log("TEST login Success!!!");
      console.log(`VALUE: ${testLoginDTO.id}`);
      const user = await User.findOne({ name: "김이" }).exec();
      return res.status(200).json({ msg: "OK", error: false, user: User });
    }
  } catch (error) {
    console.error("testLogin Error");
    console.error(error);
    return res.status(500).json({ msg: "에러발생" });
  }
};
