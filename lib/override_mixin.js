module.exports = override_mixin;

function override_mixin(last, now) {
  for(var key in now) {
    last[key] = now[key];
  }

  return function(now2) {
    if(!now2) return last;
    return override_mixin(last, now2);
  };
}