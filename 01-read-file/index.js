const fs = require('fs');
const path = require('path');
const stream = new fs.ReadStream(path.join(__dirname, 'text.txt'), 'utf8');

stream.on('data', (chunk) => {
  console.log(chunk);
});
