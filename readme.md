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

### TOC(list) 기능 데이터베이스 연결

### 상세보기(Read) 기능 데이터베이스 연결

### 글 생성(Create) 기능 데이터베이스 연결

### 글 수정(Update) 기능 데이터베이스 연결

### 글 삭제(Delete) 기능 데이터베이스 연결

### 상세보기(Read) 기능 관계형으로 연결. 저자 정보 추가

### 글 생성(Create) 기능 저자 선택 기능 추가

### 글 수정(Update) 기능 저자 선택 기능 추가

## 리팩토링

### db 모듈 생성. DB 접속 정보를 해당 모듈에 분리

### topic 모듈 생성. home 부분을 topic으로 이전

### topic 모듈 생성. create, update, delete 부분을 topic으로 이전

## 저자 기능 구현

### author 모듈 생성. 저자 목록(Read) table 구현

### author 저자 목록 생성(Create) 구현

### author 저자 목록 수정(Update) 구현

### author 저자 목록 삭제(Delete) 구현

해당 저자가 작성한 topic도 함께 지워지도록 함

## 보안 : SQL Injection

사용자가 외부에서 `DROP table author`등의 명령을 실행할 수 있다면?

목록 페이지에서 현재 다음과 같은 url이 노출된다.

``` url
http://localhost:3000/?id=3
```

보안을 신경 쓰지 않는다면, 이 url뒤에 DROP TABLE Query 문을 붙이는 등의 방식으로 악의적인 쿼리가 실행될 수 있다.

``` url
http://localhost:3000/?id=3;DROP table topic;
```

위의 사례에서는 다음과 같은 쿼리문이 생성된다.
하여 쿼리문이 실제로 실행되고나 하지 않는다.

``` query
SELECT *
  FROM toic
  LEFT JOIN author ON topic.author_id=author.id
  WHERE
    topic.id='1;DROP TABLE topic;'

```

### 최악의 상황 가정하기

만일 아래와 같은 방식으로 목록을 불러오는 쿼리문을 실행하고 있었다면? `${queryData.id}` 부분에 주목하자.

``` javascript
db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=${queryData.id}`, (error2, topic) => {
  ... // Something
}
```

다음과 같은 쿼리문이 만들어지게 된다.

``` query
SELECT *
  FROM toic
  LEFT JOIN author ON topic.author_id=author.id
  WHERE
    topic.id=1;
    DROP TABLE topic;
```

`multipleStatements` 속성이 true로 지정되어 있다면 `DROP TABLE topic;`이 서버로 전송되어 실행되는것이다.

### 쿼리문 보호하기

#### 방법 1. 필요한 인자를 ? 로 받기

실행이 되지 않는 이유는 다음과 같이 `topic.id=?` 부분을 인자로 받고 있기 때문이다. 

``` javascript
db.query('SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?', [queryData.id], (error2, topic) => {
  ... // Something
}
```

위의 코드처럼 물음표로 사용자에게 들어오는 데이터를 치환하는 작업이 필요하다.

#### 방법 2. db.escape 사용

`db.escape()`를 사용하여 인자가 들어가는 부분을 필터링하는 것이다.

``` javascript
db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=${db.escape(queryData.id)}`, (error2, topic) => {
  ... // Something
}
```

## 보안 : 데이터베이스에서 읽어오는 정보에 sanitize-html 적용