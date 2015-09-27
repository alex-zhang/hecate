module.exports = function(metaText, metaIdx) {
  var metaJson;
  try {
    metaJson = JSON.parse(metaText);
  } catch(err) {
    console.log("JSON Format Error\n" + metaText);
    throw err;
  }

  metaJson['class'] = metaJson['class'] || "";
  metaJson['class'] = 'step ' + metaJson['class'];
  metaJson['id'] = metaJson['id'] || "impress_card_" + metaIdx;

  var propsChars = "";
  for(var metaKey in metaJson) {
    propsChars += ` ${metaKey}="${metaJson[metaKey]}"`;
  }

  //attention her, there's no close tag.
  return `<!-- ============= -->\n<div${propsChars}>\n`;
}