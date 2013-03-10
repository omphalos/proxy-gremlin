Proxy Gremlin
=============

Proxy Gremlin is a tiny library that helps you to intercept and alter proxied responses.
It is a middleware-type tool intended for use with [node-http-proxy](https://github.com/nodejitsu/node-http-proxy).

Example
=======

    var http    = require('http')
      , proxy   = require('http-proxy')
      , gremlin = require('proxy-gremlin')

    http.createServer(function(req, res) { // Start an http server.

      // Proxy the request.
      proxy.proxyRequest(req, res, {
        host: proxiedHost, // put your proxied host here
        port: proxiedPort  // put your proxied port here
      })

      // Tell proxy-gremlin to intercept this response before it goes out.
      gremlin.intercept(res, function interceptor(buffer) {

        // Log buffered response info.
        console.log(buffer.headers)
        console.log(buffer.encoding)
        console.log(buffer.statusCode)
        console.log(buffer.getData())

        // Change the response.
        buffer.headers['content-type'] = 'text/html' // Change a header.
        buffer.setData('Hello world')                // Change the response's data.
      })

    }).listen(8080)

License
=======

MIT
