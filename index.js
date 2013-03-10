var util = require('util')

function Buffer(res) {

  var self = this

  self.res = res

  // Incoming data is stored in headers, _chunks, as well as statusCode and encoding
  self.headers = {}
  self._chunks = []

  // Monkey patch the response.
  self._end = res.end
  self._write = res.write
  self._writeHead = res.writeHead

  // Helper function for saving written chunks.
  function write(chunk, encoding) {

    if(chunk) self._chunks.push(chunk)
    if(encoding) self.encoding = encoding
  }

  // Intercept written headers and save them for later.
  res.writeHead = function(statusCode, headers) {

    self.headers = headers
    self.statusCode = statusCode

    res.emit('writeHead', headers, statusCode)
  }

  // Intercept written chunks and save them for later.
  res.write = function(chunk, encoding) {

    write(chunk, encoding)

    res.emit('write', chunk, encoding)
  }

  // Intercept response end.  Normally this will send the response to the client.
  res.end = function(chunk, encoding) {

    write(chunk, encoding)

    res.emit('end', chunk, encoding)
  }
}

// If setData has been called, return that, otherwise return intercepted data.
Buffer.prototype.getData = function getData() {
  return this._data || this._chunks.join('')
}

// Overwrite the response data.
Buffer.prototype.setData = function setData(data) {

  this.headers['content-length'] = data.length
  this._data = data
}

// Since Buffer intercepts res.end,
// send provides a way for the user to send the response to the client.
Buffer.prototype.send = function send() {

  this._writeHead.call(this.res, this._statusCode, this.headers)
  this._end.call(this.res, this.getData(), this.encoding)
}

exports.Buffer = Buffer
