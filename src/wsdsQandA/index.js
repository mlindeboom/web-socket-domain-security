
var keys = require('./keys.js');
var questions = require('./questions.js');
exports.handler = async (event) => {
    var returnValue = {};
    switch (event.body.action) {
        case 'getQuestion':
            
            //pick a random number between 0-9
            var qidx = Math.floor(Math.random() * 10);
            //get and return the question at a random index position
            var myquestions = questions();
            returnValue = {question: myquestions[qidx].toString(),index: qidx};
            break;
            
        case 'getAnswer':
            /*lookup question at a given position and execute 
            the code to get the answer*/
console.log(JSON.stringify(event))
            var myanswers = questions();
            var myanswerfunction = myanswers[event.body.index];
            console.log('getAnswer:'+myanswerfunction);
            returnValue = myanswerfunction(keys);
            
             
            
            // code
            break;
        
        default:
            // code
            returnValue = 'no valid return';
            
    }
    
    
    // TODO implement
    const response = {
        statusCode: 200,
        body: returnValue,
    };
    return response;
};



