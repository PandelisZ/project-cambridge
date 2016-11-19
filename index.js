var express = require('express')
var app = express()
var url = require('url');

var http = require('http');
var fs = require('fs');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/cdn/*', (req, res) => {
  //const file = parseFileURL(req.params.file)
  const requestip = req.ip
  const fileUrl = req.params[0]

  console.log(req.params[0])

  getRemoteFile(fileUrl, (response) => {
    console.log('ok')
  })

  res.send('ok')
})

var parseFileURL = (urlin) => {
  const parsed = url.parse(urlin)
  return parsed
}

var getRemoteFile = (content, cb) => {
  const fileName = 'file3.jpg'
  var file = fs.createWriteStream(fileName)
  var request = http.get(content, (response) => {
    response.pipe(file)
    file.on('finish', () => {
      file.close(cb);  // close() is async, call cb after close completes.
    })
    .on('error', function(err) { // Handle errors
    fs.unlink(fileName); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  })
  })
}

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
