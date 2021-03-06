// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};


/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var globalId = 1;

// var chatLog = {
//   results: [
//     {
//       'username': 'James',
//       'text': 'First!',
//       'createdAt': '2017-10-21T00:46:46:168Z',
//       'roomname': 'lobby'
//     },
//     {
//       'username': 'Enkhtushig',
//       'text': 'Second...',
//       'createdAt': '2017-10-21T00:46:46:330Z',
//       'roomname': 'lobby'
//     }]
// };

var chatLog = {
  results: []
};
// var chatLog = {
//   results: []
// };

var requestHandler = function(request, response) {
  // console.log(request);
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  
  var validURL = false;
  
  if (request.url === '/chatterbox/classes/messages' || request.url === '/classes/messages') {
    validURL = true;
  }

  // The outgoing status.
  // var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  
  if (!validURL) {
    response.writeHead(404, headers);
    response.end();
  }

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  
  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  } else if (request.method === 'GET') {
    response.writeHead(200, headers);
    var toSend = JSON.stringify(chatLog);
    response.end(toSend);
    console.log('GET Response Finished: ', response.finished);
  } else if (request.method === 'POST') {
    response.writeHead(201, headers);
    var body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      console.log('Body:\n', body);
      body = JSON.parse(body);
      body.objectId = globalId;
      globalId++;
      chatLog.results.push(body);
    });
    
    response.end('{"success" : "Created Successfully", "status": 201, "thisIs": "hogwash"}');
  } else {
    response.writeHead(404, headers);
    response.end();
  }

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('\nHello, World!');
};

module.exports.requestHandler = requestHandler;

