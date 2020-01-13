const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale('th');

// router.use("/help", require("./helper"));
router.use('/',function (req, res) {res.send('hello')})
module.exports = router;