'use strict';

// Greeter Lambda
exports.handler = (event, context, callback) => {
  console.log('Event:', JSON.stringify(event));
  const who = event.who || 'World';
  const response = {greeting: `Hello, ${who}!`};
  callback(null, response);
};
