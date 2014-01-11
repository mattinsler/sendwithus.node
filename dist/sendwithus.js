(function() {
  var Api, EmailApi, EmailsApi, Rest, Sendwithus,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Rest = require('rest.node');

  Api = {
    Emails: EmailsApi = (function() {
      function EmailsApi(client) {
        this.client = client;
      }

      EmailsApi.prototype.list = function(cb) {
        return this.client.get('/emails', cb);
      };

      EmailsApi.prototype.create = function(opts, cb) {
        return this.client.post('/emails', cb);
      };

      return EmailsApi;

    })(),
    Email: EmailApi = (function() {
      function EmailApi(client, id) {
        this.client = client;
        this.id = id;
      }

      EmailApi.prototype.send = function(opts, cb) {
        opts.email_id = this.id;
        return this.client.post('/send', opts, cb);
      };

      return EmailApi;

    })()
  };

  Sendwithus = (function(_super) {
    __extends(Sendwithus, _super);

    Sendwithus.hooks = {
      json: function(request_opts, opts) {
        if (request_opts.headers == null) {
          request_opts.headers = {};
        }
        return request_opts.headers.Accept = 'application/json';
      },
      auth: function(api_key) {
        return function(request_opts, opts) {
          return request_opts.auth = {
            username: api_key,
            password: ''
          };
        };
      },
      json_body: function(request_opts, opts) {
        return request_opts.json = opts;
      }
    };

    Sendwithus.prototype.parse_response_body = function(headers, body) {
      if (typeof body !== 'string') {
        return body;
      }
      if (!(body[0] === '{' && body[body.length - 1] === '}')) {
        return body;
      }
      return JSON.parse(body);
    };

    function Sendwithus(options) {
      this.options = options != null ? options : {};
      Sendwithus.__super__.constructor.call(this, {
        base_url: this.options.base_url || 'https://api.sendwithus.com/api/v1_0'
      });
      this.hook('pre:request', Sendwithus.hooks.json);
      if (this.options.api_key != null) {
        this.hook('pre:request', Sendwithus.hooks.auth(this.options.api_key));
      }
      this.hook('pre:post', Sendwithus.hooks.json_body);
      this.emails = new Api.Emails(this);
    }

    Sendwithus.prototype.email = function(id) {
      return new Api.Email(this, id);
    };

    return Sendwithus;

  })(Rest);

  module.exports = Sendwithus;

}).call(this);
