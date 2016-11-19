var express = require('express')
var app = express()
var url = require('url');
var port = process.env.PORT || 3000;
var path = require('path')

var http = require('http');
var fs = require('fs');

var validUrl = require('valid-url');

var genHash = require('./genHash.js')

//options for res.sendfile
var options = {
    root: __dirname + '/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/cdn/*', (req, res) => {
  //const file = parseFileURL(req.params.file)
  const requestip = req.ip
  const fileUrl = req.params[0]

  console.log(req.params[0])

  getRemoteFile(fileUrl, (fileName) => {
    console.log(fileName)
    console.log('ok')
    res.sendFile(fileName, options)
  })
})

var parseFileURL = (urlin) => {
  const parsed = url.parse(urlin)
  return parsed
}

var compareFiles = (file) => {
  const fileName = genFileName(file)
  fs.readFile(fileName, function (err, data) {
    if (err){
      return false
    }else {
      if (checkChecksum(file) === genchecksum(data)) {
        return true
      }
      else {
        return false
      }
    }

  })
}

function genFileName(file){
  return genHash.sha1(file) + path.extname(file)
}

var checkChecksum = (content) => {
  var request = http.get(content, (response) =>{
    return genHash.checksum(response)
  })
}

var getRemoteFile = (content, cb) => {
  var fileName = genFileName(content)
  var file = fs.createWriteStream(fileName)
  var request = http.get(content, (response) => {
    response.pipe(file)
    file.on('finish', () => {
      file.close(cb(fileName));  // close() is async, call cb after close completes.
    })
    .on('error', function(err) { // Handle errors
    fs.unlink(fileName); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
    })
  })
}

var isUrl = (url) => {
  if (validUrl.isWebUri(url)){
      return true
  } else {
      return false
  }
}

app.listen(port, () => {
  console.log('Example app listening on port 3000!')
})
