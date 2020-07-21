exports = module.exports = function (io) {
  io.sockets.on("connection", function (socket) {
    socket.on("message", function () {
      console.log("the Event Triggered");
    });
  });
};
