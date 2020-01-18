/*
    Called from the stepfunction and updates the connection database indicating that a 
    connection was validated
*/

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

//Read connectionId from event and update corresponding database record
exports.handler = (event, context, callback) => {
    const connectionId = event.connectionId;
    validateConnectionId(connectionId).then(() => { callback(null, { statusCode: 200, }) });
};


//Overwrite existing connection record to indicate that the connection was validated
function validateConnectionId(connectionId) {
    return ddb.put({ TableName: 'WebSocketDomainSecurity', Item: { connectionId: connectionId, validated: 'yes'} }).promise();
}
