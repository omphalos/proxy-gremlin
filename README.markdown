Proxy Gremlin
=============

Proxy Gremlin is a tiny library that helps you to intercept and alter proxied responses.
It is a middleware-type tool intended for use with [node-http-proxy](https://github.com/nodejitsu/node-http-proxy).

Example
=======

    var http = require('http')
      , proxy = require('http-proxy')
      , gremlin = require('proxy-gremlin')

    http.createServer(function(req, res) { // start an http server

      // tell proxy-gremlin to buffer the response
      var buffer = new gremlin.Buffer(res)

      // set up a listener for when the proxied response is ready
      res.on('end', function() {

        console.log(buffer.headers)                  // log the headers
        console.log(buffer.encoding)                 // log the specified encoding
        console.log(buffer.getData())                // log buffered data

        buffer.headers['Content-Type'] = 'text/html' // change a header
        buffer.setData('Hello world')                // change the response's data
        buffer.send()                                // send the response
      })

      // Proxy the request
      proxy.proxyRequest(req, res, {
        host: proxiedHost,
        port: proxiedPort
      })

    }).listen(8080)

License
=======

MIT
