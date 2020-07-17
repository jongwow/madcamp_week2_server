import "./env";
import server from "./server";

// 포트 설정하기. TODO: http 통신시 80으로 바꾸기. https는 443
const { PORT } = process.env;
const port = 3000 || PORT;

// Server 열기
server.listen(port, () => {
  console.log(`listening to port ${port}`);
});
