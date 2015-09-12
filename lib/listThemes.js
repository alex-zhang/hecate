var fs = require('fs');
var path = require('path');

module.exports = function() {
  function list() {
    var themeFiles = fs.readdirSync(path.join(__dirname, '../themes'));

    return themeFiles;
  }

  return list;
}

module.exports.DEFAULT_THEME = 'gentoo';
