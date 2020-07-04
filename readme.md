# Node.js & MySQL

## 학습 준비

`example.sql`로 데이터베이스 생성

## mysql (nodejs-mysql)

`mysql`은 node.js에서 mysql을 제어할 수 있도록 하는 모듈이다.

```
npm install --save mysql
```

## 모듈로 MySQL 쿼리 날려 출력해보기

`nodejs.mysql.js`에 테스트 소스코드를 구성하여 이를 `console.log`로 출력해보도록 하였다.
(github에 올라갈때 호스트 정보가 공개되지않고자 password 모듈을 따로 구성함)


``` javascript
const mysql      = require('mysql');
const master   = require('../password')
const connection = mysql.createConnection({
  host     : master.host,
  user     : master.user,
  password : master.password,
  database : master.database
});
 
connection.connect();
 
connection.query('SELECT * FROM topic', (error, results, fields) => {
  if (error) console.log(error);
  console.log(results);
});
 
connection.end();
```

작성 후 실행해보면 데이터베이스에 쿼리를 날려 topic data를 잘 가져와 출력함.

### 부분 해부

* `createConnection` : 데이터베이스 접속정보를 기입하는 부분. 이를 상수로 선언하여 계속 사용함.
* `connection.connect()` : 데이터베이스에 연결(connect)
* `connection.query` : mysql 쿼리문을 작성

## MySQL과 어플리케이션 연결

기존에 /data에 연결되었던 data들을 MySQL 데이터베이스 데이터로 변경하는 작업

## TOC(list) 기능 데이터베이스 연결

## 상세보기(Read) 기능 데이터베이스 연결

## 글 생성(Create) 기능 데이터베이스 연결