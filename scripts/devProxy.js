const http = require('http');
const httpProxy = require('http-proxy');

const proxyApi = new httpProxy.createProxyServer({
  target: {
    host: '127.0.0.1',
    port: 5000,
  },
});

const proxyStencil = new httpProxy.createProxyServer({
  target: {
    host: '127.0.0.1',
    port: 3333,
  },
});
const proxyServer = http.createServer(function (req, res) {
  if (req.url.match(/\/api/)) {
    req.url = req.url.replace('/api', '');
    proxyApi.web(req, res);
  } else {
    proxyStencil.web(req, res);
  }
});

//
// Listen to the `upgrade` event and proxy the
// WebSocket requests as well.
//
proxyServer.on('upgrade', function (req, socket, head) {
  proxyStencil.ws(req, socket, head);
});

console.log('Listen: http://127.0.0.1:8080');
proxyServer.listen(8080);
