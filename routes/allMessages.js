const express = require("express");
const router = express.Router();
const { getAllMessages } = require("../handlers/messages");

router.get("/", getAllMessages);

module.exports = router;
