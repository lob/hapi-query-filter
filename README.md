# Hapi Query Filter
[![Build Status](https://travis-ci.org/lob/hapi-query-filter.svg)](https://travis-ci.org/lob/hapi-query-filter)
[![Coverage Status](https://coveralls.io/repos/lob/hapi-query-filter/badge.svg?branch=master)](https://coveralls.io/r/lob/hapi-query-filter?branch=master)
[![NPM version](https://badge.fury.io/js/hapi-query-filter.svg)](https://npmjs.org/package/hapi-query-filter)
[![Downloads](http://img.shields.io/npm/dm/hapi-query-filter.svg)](https://npmjs.org/package/hapi-query-filter)

The purpose of this plugin is to convert query parameters into a single filter object that is accessible via `request.query.filter`.

# Registering the Plugin
```javascript
var Hapi = require('hapi');

var server = new Hapi.Server();

server.register([
  {
    register: require('hapi-query-filter'),
    options: {
      ignoredKeys: ['count', 'offset'], // Array of query parameters not to convert to filter object
      defaultEnabled: true // if true plugin will be used on all routes
    }
  }
], function (err) {
  // An error will be available here if anything goes wrong
});
```
