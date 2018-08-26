const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImageUrl: {
    type: String
  }
});

//use hook to hash password before saving user to db
userSchema.pre("save", async function(next){
  try {
    if (!this.isModified("password")) { //if password not changed, move on
      return next();
    }
    let hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  }
  catch(err){
    return next(err);
  }
});

//compare possible password with stored password hash
userSchema.method.comparePassword = async function(candidatePassword, next){
  try {
    let isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  }
  catch(err){
    return next(err);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
