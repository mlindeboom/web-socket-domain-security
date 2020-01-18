/*
    Called after the browser has executed the transmitted Javascript code and returned a 
    result through the WebSocket connection. This function will send a stepfunction token to 
    terminate the workflow. Results will be evaluated and TaskSuccess or TaskFailure will be
    called based upon the result. 
*/

const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();
var lambda = new AWS.Lambda({
  region: 'us-east-1' 
});


exports.handler = (event, context, callback) => {
    console.log('wsdsVerificationResult event:'+JSON.stringify(event));
    var myObject = JSON.parse(event.body);
    console.log('wsdsVerificationResult.msg:'+JSON.stringify(myObject.msg));
    console.log('wsdsVerificationResult.token:'+JSON.stringify(myObject.token));
    console.log('wsdsVerificationResult.index:'+myObject.msg.index);
    var connectionId = event.requestContext.connectionId;
    
    /*call wsdsQandA to get the answer for the selected index
    and verify that the answer matches the question*/
    
    lambda.invoke({
      FunctionName: 'wsdsQandA',
      Payload: JSON.stringify({"body": {"action": "getAnswer","index": myObject.msg.index}}, null, 2) // pass params
    }, function(err, data) {
    if (err) {
        console.log(err, err.stack); // an error occurred
        console.log('wsdsVerificationResult: Failure unexpected');
        //proceed to Task failure
        taskFailure(myObject.token);    
    } else {
        console.log('called wsdsQandA:'+JSON.stringify(data));           // successful response
        var myPayload = JSON.parse(data.Payload);
        var answerKey = myPayload.body.key;
        if(answerKey === myObject.msg.key){
            
            //TODO: check that domain is whitelisted
            
            console.log('wsdsVerificationResult: Passed');
            //proceed to task success        
            taskSuccess(myObject.token, connectionId);    
        }else{
            console.log('wsdsVerificationResult: Failed');
            //proceed to task failure        
            taskFailure(myObject.token);    
        }
    }     
    
    });   
    

    var response = {
        "statusCode": 200
    };
    
    callback(null, response);
    

};

function taskSuccess(token,connectionId) {
    var params = {
        output: '{"status": "success", "goto": "pass", "connectionId": "' + connectionId + '"}',
        taskToken: token
    };
    
    console.log('wsdsVerificationResult: calling success stepfunction with' + JSON.stringify(params));
    stepfunctions.sendTaskSuccess(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log('stepfunctions.sendTaskSuccess: ' + JSON.stringify(data));           // successful response
        console.log('sendTaskSuccess:done');
    });

}

function taskFailure(token) {
    var params = {
        output: '{"status": "success", "goto": "fail"}',
        taskToken: token
    };
    
    console.log('wsdsVerificationResult: calling failure stepfunction with' + JSON.stringify(params));
    stepfunctions.sendTaskSuccess(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log('stepfunctions.sendTaskFailure: ' + JSON.stringify(data));           // successful response
        console.log('sendTaskFailure:done');
    });

}
