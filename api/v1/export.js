const express = require("express");
const router = express.Router();
const XLSX = require("xlsx");
const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const FormData = require('form-data');
const archiver = require('archiver');
const word2pdf = require('word2pdf');
const extract = require('extract-zip')
const fsx = require('fs');

router.get("/excel", function (req, res, next) {
  var wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "SheetJS Tutorial",
    Subject: "Test",
    Author: "Mookiie",
    CreatedDate: new Date()
  };
  wb.SheetNames.push("Test Sheet");
  // var data = [['hello','world']]
  var data = []
  // var ws = XLSX.utils.aoa_to_sheet(data);
  var ws = XLSX.utils.json_to_sheet(data);
  // var ws = XLSX.utils.aoa_to_sheet(data);
  wb.Sheets["Test Sheet"] = ws;
  var xlsx_name = 'AppFile.xlsx'
  var newpath = path.resolve("Export") + "/" + xlsx_name;
  XLSX.writeFile(wb, newpath, { type: "application/xlsx" });
  // var api = 'http://172.18.60.2:8009/api/v1/utility/file/upload'
  // let form = new FormData();
  // let file = fsx.createReadStream(newpath)
  // let size = fs.statSync(newpath).size
  // form.append('file', file);
  // axios
  //   .create({
  //     headers: form.getHeaders()
  //   })
  //   .post(api, form)
  //   .then(response => {
  //     console.log(response.data);
  //     res.status(200).json(response.data)
  //   }).catch(error => {
  //     if (error.response) {
  //       console.log(error.response);
  //     }
  //     console.log(error.message);
  //   });
  // fs.remove(newpath)
})

router.get("/csv", function (req, res, next) {
  var wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "SheetJS Tutorial",
    Subject: "Test",
    Author: "Mookiie",
    CreatedDate: new Date()
  };
  wb.SheetNames.push("Test Sheet");
  // var data = [['hello','world']]
  var data = [
    {
      "name": "alice",
      "age": 22,
      "salary": "2,200",
      "date": "2|20|0",
      "gender": "Female"
    },
    {
      "name": "Yorn",
      "age": 33,
      "salary": "2,200",
      "date": "2|20|0",
      "gender": "Male"
    },
    {
      "name": "Zephy",
      "age": 45,
      "salary": "2,200",
      "date": "2|20|0",
      "gender": "Male"
    }
  ]
  var data = []
  // var ws = XLSX.utils.aoa_to_sheet(data);
  var ws = XLSX.utils.json_to_sheet(data);
  wb.Sheets["Test Sheet"] = ws;
  var csv_name = "YesFile.txt";
  var newpath = path.resolve("Export") + "/" + csv_name;
  var stream = XLSX.stream.to_csv(ws,{FS:"|"});
  stream.pipe(fs.createWriteStream(`${newpath}`));
  res.status(200).json(newpath)
  return
  var api = 'http://172.18.60.2:8009/api/v1/utility/file/upload'
  let form = new FormData();
  let file = fsx.createReadStream(newpath)
  let size = fs.statSync(newpath).size
  form.append('file', file);
  axios
    .create({
      headers: form.getHeaders()
    })
    .post(api, form)
    .then(response => {
      console.log(response.data);
      res.status(200).json(response.data)
      // fs.unlink(newpath)
    }).catch(error => {
      if (error.response) {
        console.log(error.response);
      }
      console.log(error.message);
    });
})

router.get("/zip", function (req, res, next) {
  var pathFile = path.resolve("Export") + '/' + 'example.zip';
  var output = fs.createWriteStream(`${pathFile}`);
  var archive = archiver('zip', {
    gzip: true,
    zlib: { level: 9 } // Sets the compression level.
  });

  archive.on('error', function (err) {
    throw err;
  });
  archive.pipe(output);
  // archive.directory('./Voices/*.mp3',false)
  archive.glob('./Voices/*.mp3',false)
  archive.finalize();
  let file = fs.createReadStream(pathFile)
  let size = fs.statSync(pathFile).size

})

router.get('/word2pdf', function (req, res, next) {
  var pathFile = path.resolve("Export") + '/';
  word2pdf(`${pathFile}testI.docx`)
    .then(function (response) {
      console.log('then');
      fsx.writeFileSync(`${pathFile}testI.pdf`, response)
    }).catch(function (err) {
      console.log(err);
    })
})
router.get('/msoffice',function (req, res, next) {
 
  var msopdf = require('node-msoffice-pdf');
  res.status(200).json({m:"1234"})
  return
  var pathFile = path.resolve("Export") + '\\';
  return
  msopdf(null, function(error, office) {
    return
    office.word({input: `${pathFile}appFile.docx`, output: `${pathFile}outfile.pdf`}, function(error, pdf) { 
      if (error) { 
           /* 
               Sometimes things go wrong, re-trying usually gets the job done
               Could not get remoting to repiably not crash on my laptop
           */
           console.log("Woops", error);
       } else { 
           console.log("Saved to", pdf);
       }
   });
  })
})
router.get('/extract', function (req, res, next) {
  var pathFile = path.resolve("Export") + '/' + 'example.zip';
  extract(pathFile, { dir: path.resolve("Export") }, function (err) {
    console.log(err);
    // extraction is complete. make sure to handle the err
  })
})

router.get('/downloadMp3', function (req, res, next) {
  let data = {
    "voiceResult": [
      {
        "fileName": "127306_mike.mp3",
        "downloadUrl": "http://172.18.34.101:9021/download/Export/mike_test1/127306_mike.mp3",
        "isSuccess": true,
        "message": ""
      },
      {
        "fileName": "127309_mike.mp3",
        "downloadUrl": "http://172.18.34.101:9021/download/Export/mike_test1/127309_mike.mp3",
        "isSuccess": true,
        "message": ""
      }
    ],
    "message": null
  }
  data.voiceResult.map(function (item) {
    let Url = item.downloadUrl
    let pathFile = path.resolve("Voices") + '/';
    axios
      .get(Url)
      .then(function (response) {
        fsx.writeFileSync(`${pathFile}${item.fileName}`, response)
      })
  })
})
module.exports = router;