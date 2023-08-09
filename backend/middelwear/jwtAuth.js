require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')
const secret =process.env.SECRET;
const ceakAuth = async (req, res, next) => {
  const { token } = req.cookies;
    if (!token) {
      return res.status(401).json(responses.UNAUTHORIZED());
    }
  // const token = authorization.split(" ")[1];
  try {
    // let istoken = req.cookie;
    // console.log(istoken);
    // if (!istoken) {
    //   console.log(istoken);
    //   return res.status(401).json({ success: false, msg: "Unauthorized" });
    // }
    // istoken = istoken.toJSON();
    const decodedata = jwt.verify(token,secret);
    req.user = await User.findById(decodedata.id);
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: "Token invalid" });
  }
};
module.exports = ceakAuth;
