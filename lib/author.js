const qs = require('querystring');
const template = require('./template');
const db = require('./db');

exports.home = (request, response) => {
  db.query(`SELECT * FROM topic`, (error, topics) => {
    db.query(`SELECT * FROM author`, (error, authors) => {
      const title = 'Author';
      const list = template.list(authors);
      const html = template.HTML(
        title,
        list,
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
      );

      response.writeHead(200);
      response.end(html);
    })
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