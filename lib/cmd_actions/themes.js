var listThemes = require('../listThemes');
var listThemesFuc = listThemes();

module.exports = function(file, options) {
  return listThemesFuc();
}
