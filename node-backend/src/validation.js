// src/validation.js
function isNonEmptyString(s, max = 255) {
  return typeof s === 'string' && s.trim().length > 0 && s.length <= max;
}

function isPrice(p) {
  return typeof p === 'number' && p >= 0 && p <= 999999.99;
}

module.exports = { isNonEmptyString, isPrice };
