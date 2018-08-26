const db = require("../models");
const jwt = require("jsonwebtoken");

exports.signin = async function (req, res, next) {
  //find a user
  try {
    let user = await db.User.findOne({
      email: req.body.email
    });
    let {id, username, profileImageUrl} = user;

    //verify password matches
    let isMatch = await user.comparePassword(req.body.password);

    //log in (create jwt and send back)
    if (isMatch) {
      let token = jwt.sign({
          id,
          username,
          profileImageUrl
        },
        process.env.SECRET_KEY
      );
      return res.status(200).json({
        id,
        username,
        profileImageUrl,
        token
      });
    }
    else {
      return next({
        status: 400,
        message: "Invalid Email/Password"
      })
    }
  }
  catch (err) {
    return next({
      status: 400,
      message: "Invalid Email/Password"
    });
  }
};

exports.signup = async function (req, res, next) {
  try {
    let user = await db.User.create(req.body);
    let {id, username, profileImageUrl} = user;
    let token = jwt.sign({
        id,
        username,
        profileImageUrl
      }, process.env.SECRET_KEY
    );
    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token
    });
    //create a user
    //sign a token for that user
    //process.env.SECRET_KEY
  }
  catch (err) {
    if (err.code === 11000) { //mongoose "duplicate document" error code
      err.message = "Sorry, that username and/or email is taken"
    }
    return next({
      status: 400,
      message: err.message
    });
  }
};