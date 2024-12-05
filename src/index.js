const express = require("express");
const authController = require("./auth/authController");
const userController = require("./user/userController");
const uploadController = require("./upload/uploadController");
const recommendController = require("./recommend/recommendController");
const craftController = require("./craft/craftController");
const historyController = require("./history/historyController");
const bookmarkController = require("./bookmark/bookmarkController");

const app = express();
app.use(express.json());

app.use("/auth", authController);
app.use("/user", userController);
app.use("/upload", uploadController);
app.use("/recommend", recommendController);
app.use("/craft", craftController);
app.use("/user/history", historyController);
app.use("/user/bookmark", bookmarkController);

// const port = process.env.PORT || 8080;
// const hostname = process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0';
// app.listen(port, hostname, async (error) => {
//   if (error) {
//     console.log(`Error: ${error.message}`);
//     return;
//   }

//   console.log(`Listening on ${hostname}:${port}`);
// });
