require("dotenv").config();
const express = require("express"),
  app = express(),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  errorHandler = require("./handlers/error"),
  authRoutes = require("./routes/auth"),
  messagesRoutes = require("./routes/messages"),
  allMessagesRoute = require("./routes/allMessages"),
  { loginRequired, ensureCorrectUser } = require("./middleware/auth.js");

const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());

//routes go here
app.use("/api/auth", authRoutes); //<base>/api/auth/<anything> uses routes in authRoutes
app.use("/api/users/:id/messages", loginRequired, ensureCorrectUser, messagesRoutes);

app.use("/api/messages", loginRequired, allMessagesRoute);

//error handling if no routes match
app.use(function(req,res,next){
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, function(){
  console.log(`Server starting on port ${PORT}.`);
});
