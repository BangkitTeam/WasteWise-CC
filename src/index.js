const express = require("express");
const authController = require("./auth/authController");
const userController = require("./user/userController");
const uploadController = require("./upload/uploadController");
const predictController = require("./ml/predictController");
const recommendController = require("./recommend/recommendController");

const app = express();
app.use(express.json());

app.use("/auth", authController);
app.use("/user", userController);
app.use("/upload", uploadController);
app.use("/prediction", predictController);
app.use("/recommend", recommendController);

app.listen(4000, () => {
  console.log("Express server is running on port 4000");
});
