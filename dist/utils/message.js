"use strict";

const momemnt = require('moment');
var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: momemnt().valueOf()
  };
};
var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: momemnt().valueOf()
  };
};
module.exports = {
  generateMessage,
  generateLocationMessage
};