var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var port = process.env.PORT || 8080;


app.post('/slack/slash-commands/send-me-buttons',urlencodedParser, function(req, res) {
    //res.status(200).end(); // best practice to respond with empty 200 status code
    var reqBody = req.body;
    var responseURL = reqBody.response_url;
    if (reqBody.token != 'COMMAND_VERIFICATION_TOKEN'){
        res.status(403).end("Access forbidden");
    }else{
        var message = {
            "trigger_id": "13345224609.738474920.8088930838d88f008e0",
            "dialog": {
                "callback_id": "ryde-46e2b0",
                "title": "Request a Ride",
                "submit_label": "Request",
                "elements": [
                    {
                        "type": "text",
                        "label": "Pickup Location",
                        "name": "loc_origin"
                    },
                    {
                        "type": "text",
                        "label": "Dropoff Location",
                        "name": "loc_destination"
                    }
                ]
            }
        }
        sendMessageToSlackResponseURL(responseURL, message);
    }
});

app.post('/slack/actions', urlencodedParser, function(req, res) {
    res.status(200).end() // best practice to respond with 200 status
var actionJSONPayload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
var message = {
    "text": actionJSONPayload.user.name+" clicked: "+actionJSONPayload.actions[0].name,
    "replace_original": false
}
sendMessageToSlackResponseURL(actionJSONPayload.response_url, message)
});


function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, function(error, response, body)  {
        if (error){
            // handle errors as you see fit
            console.log("error in sending message to slack response url");
        }
    })
};

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);

