# sendwithus.node

[Sendwithus](https://www.sendwithus.com) API client for node.js

## Installation
```
npm install sendwithus.node
```

## Usage

```javascript
var Sendwithus = require('sendwithus.node');

var client = new Sendwithus({api_key: '...'});

// List emails
client.emails.list().then(console.log);

// Create an email
client.emails.create({
  name: 'Test Email',
  subject: 'Test Email Subject',
  html: '<html><head></head><body>Valid HTML</body></html>',
  text: 'Text only email sucks'              // optional
}).then(console.log);

// Send an email - uses the email ID you can find at https://www.sendwithus.com/#/emails
client.email('email-id').send({
  recipient: {
    name: 'Matt',                            // optional
    address: 'matt.insler@gmail.com'
  },
  sender: {                                  // all sender fields optional
    name: 'Your Friend',
    address: 'me@yourfriend.com',
    reply_to: 'pleasedontreply@notreallyyourfriend.com'
  },
  email_data: {
    greeting: 'Well hello there!'
  }
});

// Callback style also works
// Just put your callback as the last argument to any method
client.emails.list(function(err, result) {
  if (err) return console.log(err.stack);
  console.log(result);
});
```

## License
Copyright (c) 2014 Matt Insler  
Licensed under the MIT license.
