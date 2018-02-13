const constants = require('./../common/constants');

module.exports = function (context, message) {
    context.log('[newUserQMsgPrcr]: ', message);
    context.bindings.messageToSend = [];

    if (message.hasOwnProperty('lastEvent')) {
        // TODO: handle input according to the last message
        if (message.lastEvent.expecting === 'emp_id') {
            let expression = /[A-Za-z]{2}[0-9]{3}/;
            if (expression.test(message.text)) {
                /** ask again once */
                let empid = message.text.match(expression)[0];
                if (constants.EMPS[empid]) {
                    context.bindings.messageToSend.push({
                        to: message.sender,
                        type: 1,
                        text: `Thanks ${constants.EMPS[empid].name}, your emp id is ${empid}. You are now registered with the Presense bot.`
                    });
                    context.bindings.userEvent = {
                        userid: message.sender,
                        empid: empid,
                        flow: constants.FLOW.NEW_USER,
                        expecting: 'nothing',
                    };
                    context.bindings.messageToSend.push({
                        to: message.sender,
                        type: 1,
                        text: `your shift timings are: ${constants.COMPANY.shift.start} to ${constants.COMPANY.shift.end} Monday to Friday.`
                    });
                } else {
                    context.bindings.messageToSend.push({
                        to: message.sender,
                        type: 1,
                        text: `The ID ${empid} doesn't match any of our records. Can you tell me the correct employee ID?`
                    });
                    context.bindings.userEvent = {
                        userid: message.sender,
                        flow: constants.FLOW.NEW_USER,
                        expecting: 'emp_id',
                    };
                }
            } else {
                /** ask again once */
                context.bindings.messageToSend.push({
                    to: message.sender,
                    type: 1,
                    text: `Can you tell me the correct employee ID once again?`
                });
                context.bindings.userEvent = {
                    userid: message.sender,
                    flow: constants.FLOW.NEW_USER,
                    expecting: 'emp_id',
                };
            }
        } else {

        }
    } else {
        context.bindings.messageToSend.push({
            to: message.sender,
            type: 1,
            text: 'Hi, Please tell me your employee ID?'
        });
        context.bindings.userEvent = {
            userid: message.sender,
            flow: constants.FLOW.NEW_USER,
            expecting: 'emp_id',
        };
    }
    context.done();
};