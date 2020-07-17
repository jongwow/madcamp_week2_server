import "./env";
import server from "./server";

// 포트 설정하기. TODO: http 통신시 80으로 바꾸기. https는 443
const { PORT } = process.env;
const port = PORT || 3000;

// Server 열기
server.listen(port, () => {
  console.log(`listening to port ${port}`);
});
