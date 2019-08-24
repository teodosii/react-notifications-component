'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./js/react-notifications.prod.js');
} else {
  module.exports = require('./js/react-notifications.dev.js');
}
