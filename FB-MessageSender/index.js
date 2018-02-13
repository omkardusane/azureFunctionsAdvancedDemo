const request = require("request");
const PAGE_ACCESS_TOKEN = 'YOUR_TOKEN';

module.exports = function (context, messageToSend) {
    context.log('[messageToSend]: ', messageToSend);
    
    switch(messageToSend.type){
        case 1:{
            textMsg(messageToSend.to, messageToSend.text); 
            break;
        }
        case 2:{
            askLocation(messageToSend.to);
            break;            
        }
    }
    
    context.done();
};

function send(body, cb) {
    const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`
    var options = {
        method: 'POST',
        url,
        headers: { 'Content-Type': 'application/json' },
        body,
        json: true
    };
    request(options, function (error, response, responseBody) {
        if (error){ 
            throw new Error(error);
            }
        if(cb){cb(responseBody);}
    });

}

function textMsg(to, txt) {
    send({
        "messaging_type": "RESPONSE",
        "recipient": {
            "id": to
        },
        "message": {
            "text": txt
        }
    })
}

function askLocation(to) {
    send({
        "messaging_type": "RESPONSE",
        "recipient": {
            "id": to
        },
        "message": {
            "text": "Please send me your current location buddy.",
            "quick_replies": [
                {
                    "content_type": "location",
                },
            ]
        },
    })
}