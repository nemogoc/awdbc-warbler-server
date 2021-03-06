const db = require("../models");

exports.createMessage = async function (req, res, next) {
  try {
    let message = await db.Message.create({
      text: req.body.text,
      user: req.params.id
    });
    let foundUser = await db.User.findById(req.params.id);
    foundUser.messages.push(message.id);
    await foundUser.save();


    let foundMessage = await db.Message.findById(message._id).populate("user", {
      username: true,
      profileImageUrl: true
    });
    return res.status(200).json(foundMessage);
  }
  catch (err) {
    return next(err);
  }
};

exports.getMessage = async function (req, res, next) {
  try { //I used findById instead of find here
    let foundMessage = await db.Message.findById(req.params.messageId).populate("user", {
      username: true,
      profileImageUrl: true
    });
    return res.status(200).json(foundMessage);
  }
  catch (err) {
    return next(err);
  }
};

exports.deleteMessage = async function (req, res, next) {
  try {
    let foundMessage = await db.Message.findById(req.params.messageId);

    //can't use findByIdAndRemove because of remove hook in schema
    await foundMessage.remove();

    return res.status(200).json(foundMessage);
  }
  catch(err){

  }
};

//this maybe shouldn't be here, since it is /messages, not /users/:id/messages
exports.getAllMessages = async function(req, res, next){
  try {
    let messages = await db.Message.find().sort({createdAt: "desc" }).populate("user", {
      username: true,
      profileImageUrl: true
    });
    return res.status(200).json(messages);
  }
  catch(err){ return next(err);}
};
