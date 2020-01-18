const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
require('./patch.js');
let send = undefined;

function init(event) {
    console.log(event);
    ///pass endpoint as part of the call
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({ apiVersion: '2018-11-29', endpoint: event.api });
    send = async(connectionId, data) => { await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: `Echo: ${data}` }).promise(); };
}


exports.handler = (event, context, callback) => {

    init(event);
    
    console.log(JSON.stringify(event));
    send(event.connectionId, event.connectionId);
    return { Status: 'success' };

};


