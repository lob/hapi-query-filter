var expect  = require('chai').expect;
var Hapi    = require('hapi');

describe('query filter plugin', function () {
  describe('check configuration', function () {
    it('should fail to load with a bad schema', function () {
      var server = new Hapi.Server();

      server.register([
        {
          register: require('../lib/'),
          options: {
            ignoredKeys: 'asdf'
          }
        }
      ], function (err) {
        expect(err).to.be.instanceof(Error);
      });
    });
  });

  describe('query filtering', function () {
    var server;

    beforeEach(function () {
      server = new Hapi.Server();
      server.connection({ port: 80 });
    });

    it('should do nothing if not enabled', function () {
      server.register({
        register: require('../lib')
      }, function () { });

      server.route({
        method: 'GET',
        path: '/test',
        handler: function (request, reply) {
          reply(request.query);
        }
      });

      server.inject('/test?a=b&c=d', function (res) {
        expect(res.result).to.eql({
          a: 'b',
          c: 'd'
        });
      });
    });

    it('should default to ignoring no keys', function (done) {
      server.register({
        register: require('../lib'),
        options: {
          defaultEnabled: true
        }
      }, function () { });

      server.route({
        method: 'GET',
        path: '/test',
        handler: function (request, reply) {
          reply(request.query);
        }
      });

      server.inject('/test?a=b&c=d', function (res) {
        expect(res.result).to.eql({
          filter: {
            a: 'b',
            c: 'd'
          }
        });
        done();
      });
    });

    it('should allow enabling at route level', function (done) {
      server.register({
        register: require('../lib')
      }, function () { });

      server.route({
        method: 'GET',
        path: '/test',
        config: {
          plugins: {
            queryFilter: {
              enabled: true
            }
          },
          handler: function (request, reply) {
            reply(request.query);
          }
        }
      });

      server.inject('/test?a=b&c=d', function (res) {
        expect(res.result).to.eql({
          filter: {
            a: 'b',
            c: 'd'
          }
        });
        done();
      });
    });

    it('should allow globally ignoring keys', function (done) {
      server.register({
        register: require('../lib'),
        options: {
          defaultEnabled: true,
          ignoredKeys: ['a']
        }
      }, function () { });

      server.route({
        method: 'GET',
        path: '/test',
        handler: function (request, reply) {
          reply(request.query);
        }
      });

      server.inject('/test?a=b&c=d', function (res) {
        expect(res.result).to.eql({
          a: 'b',
          filter: {
            c: 'd'
          }
        });
        done();
      });
    });

    it('should allow ignoring keys at route level', function (done) {
      server.register({
        register: require('../lib')
      }, function () { });

      server.route({
        method: 'GET',
        path: '/test',
        config: {
          plugins: {
            queryFilter: {
              enabled: true,
              ignoredKeys: ['a']
            }
          },
          handler: function (request, reply) {
            reply(request.query);
          }
        }
      });

      server.inject('/test?a=b&c=d', function (res) {
        expect(res.result).to.eql({
          a: 'b',
          filter: {
            c: 'd'
          }
        });
        done();
      });
    });

    it('should allow adding params to filter', function (done) {
      server.register({
        register: require('../lib'),
        options: {
          defaultEnabled: true
        }
      }, function () { });

      server.route({
        method: 'GET',
        path: '/test/{filter_param}',
        config: {
          plugins: {
            queryFilter: {
              params: ['filter_param']
            }
          },
          handler: function (request, reply) {
            reply(request.query);
          }
        }
      });

      server.inject('/test/e?a=b&c=d', function (res) {
        expect(res.result).to.eql({
          filter: {
            a: 'b',
            c: 'd',
            filter_param: 'e'
          }
        });
        done();
      });
    });
  });
});
