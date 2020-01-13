const moment = require('moment');
moment.locale('th');

var mysql = require("mysql");
// connect database
let config = mysql.createPool(configs.get('database'));
// var config  = mysql.createPool({
//   connectionLimit : 300,
//   host: "",
//   user: "",
//   password: "",
//   database: "",
//   waitForConnections: false
// });

module.exports = {
  connect: function() {
    config.connect(function(err) {
      console.log(moment().format('DD/MM/YYYY HH:mm:ss') + " - connected "+config.database);
      if (err) callback(err);
    });
  },
  query: function(sql, callback) {
      config.query(sql, function(err, result, fields) {
        if (err) {
          console.log(moment().format('DD/MM/YYYY HH:mm:ss') + " - Error : " + err);
          callback(err);
        }
        callback(result);
      });
  },
  disconnect: function() {
    config.end(function(err) {
      console.log(moment().format('DD/MM/YYYY HH:mm:ss') + " - disconnect "+config.database);
      if (err) throw err;
    });
  }
};