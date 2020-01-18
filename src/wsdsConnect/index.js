const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const stepfunctions = new AWS.StepFunctions();

exports.handler = (event, context, callback) => {
    console.log("WebSocketDomainSecurity event start" + JSON.stringify(event, null, 2));
    console.log("WebSocketDomainSecurity event end");
    const connectionId = event.requestContext.connectionId;
    const apigw = event.requestContext.domainName + '/' + event.requestContext.stage;
    //invoke a step function to relay the connection Id back to the caller. This will be used by the
    //caller to identify future communication
    invokeSendConnectionId(connectionId, apigw);
    //store the connection to be used
    addConnectionId(connectionId).then(() => {
        callback(null, { statusCode: 200, });
    });
};

function addConnectionId(connectionId) {
    return ddb.put({ TableName: 'WebSocketDomainSecurity', Item: { connectionId: connectionId }, }).promise();
}


function invokeSendConnectionId(connectionId, api){
    var inputStr = JSON.stringify({connectionId: connectionId, api: api});
    var params = {
        stateMachineArn: 'arn:aws:states:us-east-1:859026406057:stateMachine:WebSocketDomainSecuritySendConnectionId', /* required */
        input: inputStr,
        name: 'wsdsSendConnection'+Date.now()
    };
    stepfunctions.startExecution(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
}
