const fs = require('fs');
const XLSX = require("xlsx");
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const archiver = require('archiver');
const word2pdf = require('word2pdf');
const extract = require('extract-zip');
const db = require("../models/connectMssql");

module.exports = {
  excel: function (sql, filename, pathFile) {
    var wb = XLSX.utils.book_new();
    wb.Props = {
      Title: filename,
      Author: "Ruammit",
      CreatedDate: new Date()
    };
    wb.SheetNames.push(filename);
    db.query(sql, function (response) {
      if (response.length) {
        var ws = XLSX.utils.json_to_sheet(response);
        wb.Sheets[filename] = ws;
        var newpath = pathFile + filename;
        XLSX.writeFile(wb, newpath, { type: "application/xls" });
        return { status: true, msg: response, count: response.length }
      }
      else {
        return { status: true, msg: response, count: response.length }
      }
    })
  },
  csv: function (sql, filename, pathFile) {
    var wb = XLSX.utils.book_new();
    wb.Props = {
      Title: filename,
      Author: "Ruammit",
      CreatedDate: new Date()
    };
    wb.SheetNames.push(filename);
    db.query(sql, function (response) {
      if (response.length) {
        var ws = XLSX.utils.json_to_sheet(response);
        wb.Sheets[filename] = ws;
        var newpath = pathFile + filename;
        var stream = XLSX.stream.to_csv(ws);
        stream.pipe(fs.createWriteStream(`${newpath}`));
        return { status: true, msg: response, count: response.length }
      }
      else {
        return { status: true, msg: response, count: response.length }
      }
    })
  },
  zip: function (sql, filename, pathFile, directory) {
    var newpath = pathFile + filename;
    var output = fs.createWriteStream(`${newpath}`);
    var archive = archiver('zip', {
      gzip: true,
      zlib: { level: 9 } // Sets the compression level.
    });
    archive.directory(directory);
    archive.on('error', function (err) {
      throw err;
    });
    archive.pipe(output);
    archive.finalize()
    .then(function (params) {
      return { status: true, msg: '' }
    })
    .catch(function (params) {
      return { status: false, msg: '' }
    })
  },
  upload: function (pathFile, api, key) {
    let file = fs.createReadStream(pathFile)
      let form = new FormData();
      form.append( key, file);
      axios
        .create({
          headers: form.getHeaders()
        })
        .post(api, form)
        .then(response => {
          let size = fs.statSync(pathFile).size
          response.data.size = size
          return { status: true, msg: JSON.stringify(response.data, null, 4), data: response.data }
        }).catch(error => {
          return { status: false, msg: JSON.stringify(error.message, null, 4), data: error.response }
        });
  },
  word2pdf: function (dfilename,pfilename, pathFile) {
    word2pdf(`${pathFile}${dfilename}`)
      .then(function (response) {
        fs.writeFileSync(`${pathFile}${pfilename}`, response);
        return { status: true, msg: '' }
      }).catch(function (err) {
        return { status: false, msg: '' }
      })
  },
  extract: function (params) {
    extract(pathFile, {dir: path.resolve("Export")}, function (err) {
      console.log(err);
    // extraction is complete. make sure to handle the err
    })
  }
}