import "./env";
import server from "./server";
import * as Socket from "socket.io";
import { refreshTokenByToken } from "./api/v3/qr.ctrl";

// socket io 통신

// 포트 설정하기. TODO: http 통신시 80으로 바꾸기. https는 443
const { PORT } = process.env;
const port = PORT || 3000;

// Server 열기
const http = server.listen(port, () => {
  console.log(`listening to port ${port}`);
});

// socket 열기
export const io = Socket(http);

io.on("connect", (socket) => {
  console.log(`Hello~New User is connected`);
});
