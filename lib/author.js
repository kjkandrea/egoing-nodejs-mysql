const url = require('url');
const qs = require('querystring');
const template = require('./template');
const db = require('./db');
const sanitizeHtml = require('sanitize-html')

exports.home = (request, response) => {
  db.query(`SELECT * FROM author`, (error, authors) => {
    const title = 'Author';
    const html = template.HTML(
      sanitizeHtml(title),
      `
      ${template.authorTable(authors)}
      <form action="/author/create_process" method="POST">
        <p>
          <input type="text" name="name" placeholder="name">
        </p>
        <p>
          <textarea name="profile" placeholder="profile"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
      '',
      ''
    );

    response.writeHead(200);
    response.end(html);
  });
}

exports.create_process = (request, response) => {
  let body = '';
  request.on('data', (data) => {
    body = body + data
  });
  request.on('end', () => {
    const post = qs.parse(body);
    db.query(`
      INSERT INTO author (name, profile) VALUES(?, ?)`,
      [post.name, post.profile],
      (error, result) => {
        if (error) throw error;
        console.log(result);
        response.writeHead(302, {Location: `/author`});
        response.end();
      }
    )
  });
}

exports.update = (request, response) => {
  db.query(`SELECT * FROM author`, (error, authors) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM author WHERE id=?`,[queryData.id], (error2, author) => {
      console.log(author);
      const title = 'Author';
      const list = template.list(authors);
      const html = template.HTML(
        title,
        list,
        `
        ${template.authorTable(authors)}
        <form action="/author/update_process" method="POST">
          <input type="hidden" name="id" value="${queryData.id}">
          <p>
            <input type="text" name="name" placeholder="name" value="${sanitizeHtml(author[0].name)}">
          </p>
          <p>
            <textarea name="profile" placeholder="profile">${sanitizeHtml(author[0].profile)}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
      );

      response.writeHead(200);
      response.end(html);
    })
  });
}

exports.update_process = (request, response) => {
  let body = '';
  request.on('data', (data) => {
    body = body + data
  });
  request.on('end', () => {
    const post = qs.parse(body);
    
    db.query('UPDATE author SET name=?, profile=? WHERE id=?', [post.name, post.profile, post.id], (error, result) => {
      if (error) throw error;
      response.writeHead(302, {Location: `/author`});
      response.end();
    })
  });
}

exports.delete_process = (request, response) => {
  let body = '';
  request.on('data', (data) => {
    body = body + data
  });
  request.on('end', () => {
    const post = qs.parse(body);
    db.query(
      'DELETE FROM topic WHERE author_id=?',
      [post.id],
      (error, rerult) => {
        if (error) throw error;
        db.query('DELETE FROM author WHERE id=?', [post.id], (error1, result1) => {
          if (error1) throw error1;
          response.writeHead(302, {Location: `/author`});
          response.end();
        })
      }
    )
  });
}