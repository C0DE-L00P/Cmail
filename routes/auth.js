require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Controllers
const User = require("../models/userSchema.js");

const user_post_login = async (mreq, mres) => {
  // check If Email is valid

  res_user = await User.findOne({ email: mreq.body.email });

  if (!res_user)
    return mres.status(404).json({
      message: "Auth Problem: No user with such credentials",
    });

  // Now hash the password sent and compare with stored one

  bcrypt.compare(mreq.body.password, res_user.password, function (err, result) {
    if (!result)
      //Password is not correct
      return mres
        .status(404)
        .json({
          message: `Auth Problem: No user with such credentials`,
        });

    //Verified

    //JWT Creation
    const em = {
      _id: res_user._id,
      name: res_user.name,
      email: res_user.email,
      is_admin: res_user.is_admin,
    };
    const accessToken = jwt.sign(em, process.env.ACCESS_TOKEN_SECRET);

    const user = res_user.toObject(); //IMPORTANT
    user.accessToken = accessToken;

    //TODO: implement refresh token
    // , {expiresIn: '30s'}
    // const refreshToken = jwt.sign({_id: res_user._id,email: res_user.email}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'});
    // user.refreshToken = refreshToken

    delete user.password;

    mres.json(user);
  });
};

router.route("/login").post(user_post_login);

module.exports = router;