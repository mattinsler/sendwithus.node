Rest = require 'rest.node'

Api = {
  Emails: class EmailsApi
    constructor: (@client) ->
    list: (cb) -> @client.get('/emails', cb)
    create: (opts, cb) -> @client.post('/emails', cb)
  
  Email: class EmailApi
    constructor: (@client, @id) ->
    send: (opts, cb) ->
      opts.email_id = @id
      @client.post('/send', opts, cb)
}

class Sendwithus extends Rest
  @hooks:
    json: (request_opts, opts) ->
      request_opts.headers ?= {}
      request_opts.headers.Accept = 'application/json'
    
    auth: (api_key) ->
      (request_opts, opts) ->
        request_opts.auth =
          username: api_key
          password: ''
    
    json_body: (request_opts, opts) ->
      request_opts.json = opts
  
  parse_response_body: (headers, body) ->
    return body unless typeof body is 'string'
    return body unless body[0] is '{' and body[body.length - 1] is '}'
    JSON.parse(body)
  
  constructor: (@options = {}) ->
    super(base_url: @options.base_url or 'https://api.sendwithus.com/api/v1_0')
    
    @hook('pre:request', Sendwithus.hooks.json)
    @hook('pre:request', Sendwithus.hooks.auth(@options.api_key)) if @options.api_key?
    @hook('pre:post', Sendwithus.hooks.json_body)
    
    @emails = new Api.Emails(@)
    
  email: (id) -> new Api.Email(@, id)

module.exports = Sendwithus
