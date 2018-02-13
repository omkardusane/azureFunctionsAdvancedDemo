const FLOW = require('./../Common/constants').FLOW;
module.exports = function (context, receivedMessage) {
    log = context.log;

    log(receivedMessage)
    if (!receivedMessage) {
        context.done();
        return;
    }

    let formedMessage = {
        sender: receivedMessage.sender,
        timestamp: receivedMessage.timestamp,
        flow: FLOW.NEW_USER
    };

    let produce = () => {
        context.log('Producing ', formedMessage);
        switch (formedMessage.flow) {
            case FLOW.NEW_USER:
                context.bindings.newUserQ = formedMessage;
                break;
            case FLOW.SIGN:
                context.bindings.signQ = formedMessage;
                break;
            default: return;
        }
    }

    receivedMessage = receivedMessage.payload;
    const documents = context.bindings.documents;
    /** Look in the db for latest events, determine what conversation is going on */
    if (documents.length > 1) {
        var document = documents[0];// This is the latest event.
        if(document.empid){
            formedMessage.empid = document.empid;            
        }
        if (document.expecting === 'nothing') {
             // add further clauses if we have more flows 
            formedMessage.flow = FLOW.SIGN;
        } else {
            formedMessage.flow = document.flow;
            formedMessage.lastEvent = {
                expecting: document.expecting,
                expected: documents.map(d=>d.expecting)
            };
        }
    }

    /** Look at the message to determine the flow again */
    if (receivedMessage.hasOwnProperty('text')) {
        log('[JUST A TEXT] ', receivedMessage.text);
        formedMessage.text = receivedMessage.text;
        formedMessage.type = 'text';
    }
    if (receivedMessage.hasOwnProperty('attachments') && receivedMessage.attachments.length) {
        // this is an attachment
        log('[ATTACHMENTS] ');
        for (let a of receivedMessage.attachments) {
            let ap = a.payload;
            if (a.type == 'location'
                && ap.hasOwnProperty('coordinates')
                && ap.coordinates.hasOwnProperty('lat')
                && ap.coordinates.hasOwnProperty('long')
            ) {
                let cords = ap.coordinates;
                log('LOCATION ', cords);
                formedMessage.type = 'location';
                formedMessage.location = cords;
                // if user directly sends us the location
                formedMessage.flow = FLOW.SIGN;
                if (receivedMessage.hasOwnProperty('text')) {
                    formedMessage.text = receivedMessage.text;
                    if (formedMessage.lastEvent.expecting === 'nothing') {
                        delete formedMessage.lastEvent;
                    }
                }
            }
        }
    }
    produce();
    context.done();
    return;
};