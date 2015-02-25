# Hapi Query Filter
[![Build Status](https://travis-ci.org/lob/hapi-query-filter.svg)](https://travis-ci.org/lob/hapi-query-filter)
[![Coverage Status](https://coveralls.io/repos/lob/hapi-query-filter/badge.svg?branch=master)](https://coveralls.io/r/lob/hapi-query-filter?branch=master)
[![NPM version](https://badge.fury.io/js/hapi-query-filter.svg)](https://npmjs.org/package/hapi-query-filter)
[![Downloads](http://img.shields.io/npm/dm/hapi-query-filter.svg)](https://npmjs.org/package/hapi-query-filter)

The purpose of this plugin is to convert query parameters into a single filter object that is accessible via `request.query.filter`.

For example: `?first_name=John&last_name=Doe` would create a `request.query` that looks like
```javascript
{
  filter: {
    first_name: 'John',
    last_name: 'Doe'
  }
}
```

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

# Ignoring Keys
You can ignore keys to have them stay at the root level of `request.query`. A configuration of:

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

Will cause a request like `?first_name=John&last_name=Doe&count=10&offset=0` to create a `request.query` that looks like:
```javascript
{
  count: 10,
  offset: 0,
  filter: {
    first_name: 'John', 
    last_name: 'Doe'
  }
}
```

# Enabling at the Route Level
If `defaultEnabled: false` you will need to enable the plugin an a per-route basis by doing the following:
```javascript
var Hapi = require('hapi');
var server = new Hapi.Server();

server.register([
  {
    register: require('hapi-query-filter')
  }
], function (err) {
  // An error will be available here if anything goes wrong
});

server.route({
  method: 'GET',
  path: '/test',
  config: {
    handler: function (request, reply) { ... },
    plugins: {
      queryFilter: {
        enabled: true,
        ignoredKey: ['count', 'offset'], // Array will be concatenated with the ignoredKeys set at register
        params: ['test_param'] // Array of request.params that will be put into filter object
      }
    }
  }
})
```
