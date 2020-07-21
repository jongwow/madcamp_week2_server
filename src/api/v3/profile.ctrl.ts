import { RequestHandler } from "express";
import User from "../../models/user";
import ProfileImage from "../../models/profileImage";
import * as path from "path";
import * as fs from "fs";

const imagePath = path.join(__dirname, "../../../public/images");

export const uploadImage: RequestHandler = async (req, res, next) => {
  try {
    // 앞에서 업로드된 파일을 가져온다.
    const uploadedFile = req.file;
    const email = req.body.email as string;

    // 업로드된 파일이 없는 경우
    if (uploadImage == null) {
      return res
        .status(404)
        .json({ msg: "파일이 제대로 업로드되지 않았습니다" });
    }

    const user = await User.findOne({ email }).exec();
    // 존재하지 않는 이메일의 경우
    if (user == null) {
      console.log("Email Not Exist");
      return res.status(400).json({ msg: "Email Not Exist" });
    }

    // 사용자에게 profile File Name을 저장한다.
    user.profileImage = uploadedFile.filename;
    await user.save();
    // 성공적으로 파일이 업로드된 경우
    const fileInfo = {
      name: uploadedFile.originalname,
      size: uploadedFile.size,
    };
    console.log(`Uploaded file Name:${uploadedFile.filename}`);

    // DB에 이미지를 저장하는 부분
    const newImage = new ProfileImage();
    newImage.fileName = uploadedFile.filename;
    newImage.save((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "저장실패!" + JSON.stringify(err) });
      }

      // err가 존재하지 않으므로 성공반환
      return res.status(200).json({
        msg: `성공! 이름:${fileInfo.name}, size:${fileInfo.size}`,
        url: newImage.fileName,
      });
    });
  } catch (error) {
    console.error(`uploadImage Error`);
    console.error(error);
    return res.status(500).json({ msg: "Internal Error", error: true });
  }
};

export const getImageByName: RequestHandler = async (req, res, next) => {
  try {
    // 요청으로 들어온 이름을 가져옴
    const dto = {
      fileName: req.params.image_name.trim(),
    };

    // 파일의 경로를 가져온다.
    const filePath = path.join(imagePath, dto.fileName);
    console.log(`path:${filePath}`);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(err);
        return res.status(404).json({ msg: "Not Found", error: true });
      } else {
        return res.status(200).sendFile(filePath);
      }
    });
  } catch (error) {
    console.error(`getRandomImage Error`);
    console.error(error);
    return res.status(500).json({ msg: "Internal Error", error: true });
  }
};
