var util = require('util')

function Buffer(res) {

  var self = this

  self.res = res

  // Incoming data is stored in headers, _chunks, as well as statusCode and encoding
  self.headers = {}
  self._chunks = []

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

exports.intercept = function(res, interceptor) {

  // save the original response method
  var end       = res.end
    , writeHead = res.writeHead

  // Buffer monkey patches the response
  var buffer = new Buffer(res)

  res.on('end', function onResEnd() {

    // apply outgoing transformations on the buffered response
    interceptor(buffer)

    // send the response to the client
    writeHead.call(res, buffer.statusCode, buffer.headers)
    end.call(res, buffer.getData(), buffer.encoding)
  }
}
