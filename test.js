/* eslint-disable @typescript-eslint/no-require-imports */
const {createServer} = require('http');
var https = require('https');
var fs = require('fs');
const {parse} = require('url');
require('dotenv').config();
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const prod =
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_SSL_ENABLED === '1';
const app = next({dev});
const handle = app.getRequestHandler();

let options = {};
if (prod) {
  const privateKeyPath = process.env.NEXT_PUBLIC_SSL_PRIVATE_KEY;
  const fullChainPath = process.env.NEXT_PUBLIC_SSL_FULLCHAIN_KEY;

  options = {
    key: fs.readFileSync(`${privateKeyPath}`, 'utf8'),
    cert: fs.readFileSync(`${fullChainPath}`, 'utf8')
  };
}

app.prepare().then(() => {
  const readyServer = `> Ready on ${process.env.DOMAIN}:${process.env.PORT}`;

  if (prod) {
    https
      .createServer(options, (req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true);
        const {pathname, query} = parsedUrl;
        if (pathname === '/a') {
          app.render(req, res, '/a', query);
        } else if (pathname === '/b') {
          app.render(req, res, '/b', query);
        } else {
          handle(req, res, parsedUrl);
        }
      })
      .listen(process.env.PORT, (err) => {
        if (err) throw err;
      });
  } else {
    createServer((req, res) => {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const {pathname, query} = parsedUrl;
      if (pathname === '/a') {
        app.render(req, res, '/a', query);
      } else if (pathname === '/b') {
        app.render(req, res, '/b', query);
      } else {
        handle(req, res, parsedUrl);
      }
    }).listen(process.env.PORT, (err) => {
      if (err) throw err;
    });
  }
});
