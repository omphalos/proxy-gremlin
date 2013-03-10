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

        // log buffered response info
        console.log(buffer.headers)
        console.log(buffer.encoding)
        console.log(buffer.statusCode)
        console.log(buffer.getData())

        // change the response
        buffer.headers['Content-Type'] = 'text/html' // change a header
        buffer.setData('Hello world')                // change the response's data
        buffer.send()                                // send the response
      })

      // Proxy the request
      proxy.proxyRequest(req, res, {
        host: proxiedHost, // put your proxied info here
        port: proxiedPort  // put your proxied port here
      })

    }).listen(8080)

License
=======

MIT
