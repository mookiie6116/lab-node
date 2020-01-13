let Client = require('ssh2-sftp-client');
const configs = require('config');
const fs = require("fs")
let sftp = new Client();
const config = configs.get('ftp');
// const config ={
//   "host": "",
//   "port": "",
//   "username": "",
//   "password": ""
// }
const ftp_path = configs.get('ftp_path');
const ftp_option = configs.get('ftp_options');
module.exports = {
  connect: function () {
    sftp.connect(config).then(() => {
      // console.log(config,'sftp request');
      // return sftp.list('/pathname');
    }).then((data) => {
      console.log(data,'sftp connect');
      // console.log(data, 'the data info');
    }).catch((err) => {
      console.log(err, 'sftp error');
    });
  },
  upload: function (localFilePath,filename) {
    let dataFile = fs.createReadStream(localFilePath);
    
    // sftp.connect(config).then((data) => {
      sftp.put(dataFile, `${ftp_path}/${filename}`)
      .then((res) => {
        console.log(`${ftp_path}/${filename}`, 'upload');
      }).catch((err) => {
        console.log(`${ftp_path}/${filename}`, 'upload error');
      })
    // })
  },
  delete: function (filename) {
    sftp.delete(`${ftp_path}/${filename}`)
    .then(() => {
      console.log(`${ftp_path}/${filename}`, 'delete');
    })
    .catch(err => {
      console.log(`${ftp_path}/${filename}`, 'delete error');
    });
  }
}