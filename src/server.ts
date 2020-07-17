import * as Express from "express";
import * as bodyParser from "body-parser";
import * as Morgan from "morgan";
import * as mongoose from "mongoose";
import dbUrl from "./dbUrl";
import api from "./api";

const app = Express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(Morgan("dev"));

// API 설정
app.use("/api/v1", api);

// 임시 Error Handler (404만)
app.use(function (req, res, next) {
  res.status(404).send("Sorry! 존재하지 않는 API이에오!");
});

// Node.js의 native Promise 사용
// mongoose.Promise = Promise; 이젠 필요없다고 한다...?
// console.log(dbUrl);
// CONNECT TO MONGODB SERVER
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to mongodb"))
  .catch((e) => {
    console.error("DB 연결 실패!");
    console.error(e);
  });

export default app;
