const http = require('http');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template');
const db = require('./lib/db');
const topic = require('./lib/topic');

http.createServer((request,response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  let title = queryData.id;

  //console.log(url.parse(_url, true))
  
  if (pathname === '/') {
    if(!queryData.id){
      topic.home(request,response);
    } else {
      topic.page(request,response);
    };
  } else if (pathname === '/create') {
    topic.create(request, response);
  } else if ( pathname === '/create_process' ) {
    topic.create_process(request, response);
  } else if ( pathname === '/update' ) {
    topic.update(request, response);
  } else if ( pathname === '/update_process') {
    topic.update_process(request, response);
  } else if ( pathname === '/delete_process') {
    topic.delete_process(request, response);
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
}).listen(3000);