const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale('th');

router.use("/export", require("./export"));
// router.use('/',function (req, res) {res.send('hello')})
module.exports = router;