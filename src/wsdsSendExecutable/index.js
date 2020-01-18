/*
This function sends a function through the web socket connection for the browser to execute. The 
function code to execute is selected randomly and sent to the browser web socket as a JSON compatible 
string payload. The wsdsQandA lambda, called by this function, will handle the function selection and 
verifiction.
*/

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
require('./patch.js');
var send = undefined;
var myfunc_as_string = undefined;

var aws = require('aws-sdk');
var lambda = new aws.Lambda({
  region: 'us-east-1' 
});

// setup the gateway to call the web socket outbound to the browser

function init(event) {
    console.log(event);
    ///pass endpoint as part of the call
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({ apiVersion: '2018-11-29', endpoint: event.api });
    send = async(connectionId, data) => { await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: `${data}` }).promise(); };
}


// Send a function through the web socket connection for the browser to execute. Also provide a token that
// will allow thebrowser to find and restart the step function which blocks after the call.
exports.handler = (event, context, callback) => {

    init(event);
   
    console.log(JSON.stringify(event));

    //here call wsdsQandA to get a random question
     console.log('about to call wsdsQandA');
    lambda.invoke({
      FunctionName: 'wsdsQandA',
      Payload: JSON.stringify({"body": {"action": "getQuestion"}}, null, 2) // pass params
    }, function(err, data) {
    if (err) {
        console.log(err, err.stack); // an error occurred
        return { Status: 'failure' };

    }
    else{
        console.log('wsdsQandA:'+JSON.stringify(data));           // successful response
        var mypayload = JSON.parse(data.Payload);
        var myfunc = mypayload.body.question;
        var myindex = mypayload.body.index;
        myfunc_as_string = myfunc.toString();
        var payload = {
            token: event.token,
            func: myfunc_as_string,
            index: myindex
        };

        send(event.connectionId, JSON.stringify(payload));
        return { Status: 'success' };

    }     
   
    });
};


