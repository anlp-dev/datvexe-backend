const find = require('find-process');
const ngrok = require("ngrok");
require('dotenv').config()
let previousPort = null;

async function killPort(port) {
    if (!port) return;
    try {
        const list = await find('port', port);
        if (list.length > 0) {
            console.log(`🔴 Đang đóng process cũ trên port ${port}...`);
            list.forEach(proc => process.kill(proc.pid, 'SIGTERM')); // Kill process theo PID
            console.log(`✅ Đã đóng process cũ trên port ${port}.`);
        } else {
            console.log(`⚠️ Không tìm thấy process nào trên port ${port}.`);
        }
    } catch (error) {
        console.log(`⚠️ Lỗi khi tìm process: ${error.message}`);
    }
}

async function startServer(app) {
    let portCustom = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000;

    await killPort(previousPort);

    previousPort = portCustom;
    if(process.env.NODE_ENV === 'prod') {
        app.listen(9999, () => {
            console.log(`🚀 Server đang chạy tại cổng 9999 tại chế độ prod`);
        });
    }else {
      app.listen(process.env.PORT, "0.0.0.0", () => {
        console.log(
          `🚀 Server đang chạy tại http://localhost:9999 tại chế độ dev`
        );
      });

      //   const url = await ngrok.connect(process.env.PORT);
      //   console.log(`🚀 Server đang chạy tại ${url} tại chế độ dev`);
    }
}

module.exports = {startServer};
