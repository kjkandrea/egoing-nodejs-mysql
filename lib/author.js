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
        `,
      );

      response.writeHead(200);
      response.end(html);
    })
  });
}