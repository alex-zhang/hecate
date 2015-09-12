var exec = require('child_process').exec;

module.exports = function() {
  var env = process.env;
  var uname = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;

  return uname;
}
