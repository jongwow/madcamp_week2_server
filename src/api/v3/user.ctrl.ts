import { RequestHandler } from "express";
import { checkHashPassword, saltHashPassword } from "../../lib/passwordManager";
import User from "../../models/user";

export const register: RequestHandler = async (req, res, next) => {
  try {
    console.log(`register start`);
    const post_data = req.body;
    const plain_password = post_data.password;
    const hash_data = saltHashPassword(plain_password);

    // get 3 변수 from 사용자
    const password = hash_data.passwordHash;
    const salt = hash_data.salt;

    const name = post_data.name;
    const email = post_data.email;

    // 페이스북 로그인이 아님
    const facebook = 0;

    const insertJson = {
      email: email,
      password: password,
      salt: salt,
      name: name,
      facebook: facebook,
    };

    const oldUser = await User.findOne({ email: email, facebook: 0 }).exec();

    if (oldUser == null) {
      const newUser = new User(insertJson);
      const result = await newUser.save();

      console.log("Registraction success");
      return res.status(200).json({ msg: "Registraction success" });
    } else {
      console.log("이미 존재하는 이메일");

      return res.status(200).json({ msg: "Email already exists" });
    }
  } catch (error) {
    console.error("register Error");
    console.error(error);
    return res.status(500).json({ msg: "Internal Error", error: true });
  }
};

// user req에서 email과 password를 받음
// email을 통해 db에서 salt를 가져와 비밀번호 대칭을 해봄
export const login: RequestHandler = async (req, res, next) => {
  try {
    console.log(`login start`);
    const dto = {
      email: req.body.email,
      password: req.body.password,
    };

    const oldUser = await User.findOne({ email: dto.email }).exec();
    // 이메일이 존재하는 경우
    if (oldUser != null) {
      console.log("Email Not Exist");
      return res.status(200).json({ msg: "Email Not Exist" });
    } else {
      // 페이스북 아이디로 회원가입된 경우
      if (oldUser.facebook === 1) {
        console.log("Facebook email already exists");
        return res
          .status(200)
          .json({ msg: "페북 아디 존재. 그걸로 로긴하셈." });
      } else {
        // 해당하는 email이 존재하는 경우
        // salt값을 통한 패스워드 비교
        const salt = oldUser.salt;
        const hashed_password = checkHashPassword(dto.password, salt)
          .passwordHash;
        const encrypted_password = oldUser.password;
        if (encrypted_password === hashed_password) {
          console.log(`Login Success`);
          return res.status(200).json({ msg: "Login Success" });
        } else {
          console.log("Wrong password");
          return res.status(200).json({ msg: "Wrong password" });
        }
      }
    }
  } catch (error) {
    console.error("login Error");
    console.error(error);
    return res.status(500).json({ msg: "Internal Error" });
  }
};

export const facebookLogin: RequestHandler = async (req, res, next) => {
  try {
    console.log(`facebookLogin start`);
    const dto = {
      // facebook AppID 꼭 받아야함.
      // 그러면 User에서도 추가해주기
      email: req.body.email,
      name: req.body.name,
    };

    const facebook = 1;

    const newUser = new User({
      email: dto.email,
      password: "0",
      salt: "0",
      name: dto.name,
      facebook: facebook,
    });

    const oldUser = await User.findOne({ email: dto.email }).exec();
    if (oldUser == null) {
      newUser.save((err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ msg: "Facebook Registration failure" });
        } else {
          return res.status(200).json({ msg: "Facebook Registration success" });
        }
      });
    } else {
      return res.status(200).json({ msg: "Facebook Registration success" });
    }
  } catch (error) {
    console.error("facebookLogin Error");
    console.error(error);
    return res.status(500).json({ msg: "Internal Error" });
  }
};
