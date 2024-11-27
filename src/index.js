const express = require("express");
const authController = require("./auth/authController");
const userController = require("./user/userController");

const app = express();
app.use(express.json());

app.use("/auth", authController);
app.use("/user", userController);

app.listen(4000, () => {
  console.log("Express server is running on port 4000");
});
