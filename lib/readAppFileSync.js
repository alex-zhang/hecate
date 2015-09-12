var fs = require('fs');
var path = require('path');

module.exports = function(file_name) {
  return fs.readFileSync(path.join(__dirname, '..', file_name), 'utf-8') || '';
}
