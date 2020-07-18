import { RequestHandler } from "express";
import TmpImage from "../../models/tmpImage";
import * as path from "path";
import * as fs from "fs";

const imagePath = path.join(__dirname, "../../../public/images");

// img1.jpg 를 반환
export const getRandomImage: RequestHandler = async (req, res, next) => {
  try {
    const filename = "/home/kaist/mongo_week2/public/images/img1.jpg";
    res.sendFile(filename);
  } catch (error) {
    console.error(`getRandomImage Error`);
    console.error(error);
  }
  return res.status(500).json({ msg: "Internal Error", error: true });
};

export const getImageByName: RequestHandler = async (req, res, next) => {
  try {
    // 요청으로 들어온 이름을 가져옴
    const DTO = {
      fileName: req.params.image_name.trim(),
    };

    // 파일의 경로를 가져온다.
    const filePath = path.join(imagePath, DTO.fileName);
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

export const uploadImage: RequestHandler = async (req, res, next) => {
  try {
    // 앞에서 업로드된 파일을 가져온다.
    const uploadedFile = req.file;

    // 업로드된 파일이 없는 경우
    if (uploadImage == null) {
      return res
        .status(404)
        .json({ msg: "파일이 제대로 업로드되지 않았습니다" });
    }

    // 성공적으로 파일이 업로드된 경우
    const fileInfo = {
      name: uploadedFile.originalname,
      size: uploadedFile.size,
    };
    console.log(`Uploaded file Name:${uploadedFile.filename}`);

    // DB에 이미지를 저장하는 부분
    const newImage = new TmpImage();
    newImage.fileName = uploadedFile.filename;
    newImage.save((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "저장실패!" + JSON.stringify(err) });
      }

      // err가 존재하지 않으므로 성공반환
      return res
        .status(200)
        .json({ msg: `성공! 이름:${fileInfo.name}, size:${fileInfo.size}` });
    });
  } catch (error) {
    console.error(`uploadImage Error`);
    console.error(error);
    return res.status(500).json({ msg: "Internal Error", error: true });
  }
};

export const getImageUrls: RequestHandler = async (req, res, next) => {
  try {
    const urls = await TmpImage.find().select({ fileName: 1, _id: 0 });
    return res.status(200).json({ msg: "성공", urls });
  } catch (error) {
    console.error(`getImageUrls Error`);
    console.error(error);
  }
};
