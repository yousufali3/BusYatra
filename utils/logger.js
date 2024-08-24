import morgan from "morgan";
import fs from "fs";
import rfs from "rotating-file-stream";
import path from "path";

export default (app) => {
  app.use(
    morgan("dev", {
      skip: function (req, res) {
        return res.statusCode < 400;
      },
    })
  );

  const logDirectory = path.join(__dirname, "../log");
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  const accessLogStream = rfs.createStream("access.log", {
    interval: "1d", // rotate daily
    path: logDirectory,
  });

  app.use(morgan("combined", { stream: accessLogStream }));
};
