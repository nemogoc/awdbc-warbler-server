require("dotenv").load();
const jwt = require("jsonwebtoken");

exports.loginRequired = function(req, res, next){
  if (req.headers.authorization  == null){
    return next({
      status: 401,
      message: "Please log in first"
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
    if(decoded){ return next();}
    else {
      return next({
        status: 401,
        message: "Please log in first"
      });
    }
  })
};

exports.ensureCorrectUser = function(req, res, next){
  if (req.headers.authorization  == null){
    return next({
      status: 403,
      message: "Unauthorized"
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
    if(decoded && decoded.id === req.params.id){ return next();}
    else {
      return next({
        status: 403,
        message: "Unauthorized"
      });
    }
  })
};
