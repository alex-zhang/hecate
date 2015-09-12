var fs = require('fs');
var os = require('os');
var path = require('path');
var readAppFileSync = require('../readAppFileSync');
var envUsername = require('../envUserName');
var listThemes = require('../listThemes');

module.exports = function(file, options) {
  // console.dir(options);
  //here is the default value
  var theme = options.theme || listThemes.DEFAULT_THEME;

  var templateHtml = readAppFileSync('./templates/template.html');
  var patternReg = /\${[\w|.]*}/g;

  templateHtml = templateHtml.replace(patternReg, eachPatternMatch);
  fs.writeFileSync(file, templateHtml);

  function eachPatternMatch(matchChars) {
    if(matchChars) {
      matchChars = matchChars.slice(2, -1);
      //first the var repalce.
      switch (matchChars) {
        case 'title':
          return options.title || path.basename(file, path.extname(file));
          break;

        case 'author':
        return envUsername();
        break;

        case 'description':
        return options.desc || '';
        break;

        case 'keywords':
        return options.keywords || path.basename(file, path.extname(file));
        break;

        case 'impress_style':
        return readAppFileSync('./themes/' + theme + '/theme.css');
        break;

        case 'impress_layout':
        return readAppFileSync('./themes/' + theme + '/layout.html');
        break;
      }

      //we think file here.
      if(matchChars.indexOf('.') !== -1) {
        var isStartWidthDoc = matchChars.indexOf('doc_') !== -1;
        if(isStartWidthDoc && !options.document) {
          return '';
        }

        return readAppFileSync('./templates/' + matchChars);
      }

      return '';
    }

    return "";
  }
}
