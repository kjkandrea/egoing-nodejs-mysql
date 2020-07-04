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
      db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) throw error;
        db.query('SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?', [queryData.id], (error2, topic) => {
          if (error2) throw error2;
          console.log(topic);
          const title = topic[0].title;
          const description = topic[0].description;
          const list = template.list(topics);
          const html = template.HTML(
            title,
            list,
            `<h2>${title}</h2>
            ${description}
            <p>by ${topic[0].name}</p>`,
            `
              <a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post" onsubmit="confirm('Are You Sure?')">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>
            `
          );

          response.writeHead(200);
          response.end(html);
        })
      })
    };
  } else if (pathname === '/create') {

    db.query(`SELECT * FROM topic`, (error, topics) => {
      db.query(`SELECT * FROM author`, (error2, authors) => {
        const title = 'Create';
        const list = template.list(topics);
        const html = template.HTML(
          title,
          list,
          `
            <form action="/create_process" method="POST">
              <p>
                <input type="text" name="title" placeholder="title">
              </p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                ${template.authorSelect(authors)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
          `,
          `<a href="create">create</a>`
        );

        response.writeHead(200);
        response.end(html);
      })
    });
  } else if ( pathname === '/create_process' ) {
    let body = '';
    request.on('data', (data) => {
      body = body + data
    });
    request.on('end', () => {
      const post = qs.parse(body);
      db.query(`
        INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
        [post.title, post.description, post.author],
        (error, result) => {
          if (error) throw error;
          console.log(result);
          response.writeHead(302, {Location: `/?id=${result.insertId}`});
          response.end();
        }
      )
    });
  } else if ( pathname === '/update' ) {
    db.query(`SELECT * FROM topic`, (error, topics) => {
      if (error) throw error;
      db.query('SELECT * FROM topic WHERE id=?', [queryData.id], (error2, topic) => {
        if (error2) throw error2;
        db.query(`SELECT * FROM author`, (error3, authors) => {
          const list = template.list(topics);
          const html = template.HTML(
            topics[0].title,
            list,
            `
              <form action="/update_process" method="POST">
                <input type="hidden" name="id" value="${topics[0].id}">
                <p>
                  <input type="text" name="title" placeholder="title" value="${topics[0].title}">
                </p>
                <p>
                  <textarea name="description" placeholder="description">${topics[0].description}</textarea>
                </p>
                <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
            `,
            `
              <a href="create">create</a>
              <a href="/update?id=${topics[0].id}">update</a>
            `
          );

          response.writeHead(200);
          response.end(html);
        })
      })
    });
  } else if ( pathname === '/update_process') {
    let body = '';
    request.on('data', (data) => {
      body = body + data
    });
    request.on('end', () => {
      const post = qs.parse(body);
      
      db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], (error, result) => {
        if (error) throw error;
        response.writeHead(302, {Location: `/?id=${post.id}`});
        response.end();
      })
    });
  } else if ( pathname === '/delete_process') {
    let body = '';
    request.on('data', (data) => {
      body = body + data
    });
    request.on('end', () => {
      const post = qs.parse(body);

      db.query('DELETE FROM topic WHERE id=?', [post.id], (error, result) => {
        if (error) throw error;
        response.writeHead(302, {Location: `/`});
        response.end();
      })
    });
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
}).listen(3000);