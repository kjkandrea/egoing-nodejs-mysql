const fs = require('fs');

// readFileSync

console.group('readFileSync')
console.log('A')
const result = fs.readFileSync('./syntax/sample.txt', 'utf-8')
console.log(result)
console.log('C')
console.groupEnd()


// readFile

console.group('readFile')
console.log('A')
fs.readFile('./syntax/sample.txt', 'utf-8', (error, result) => {
  console.log(result)
})
console.log('C')