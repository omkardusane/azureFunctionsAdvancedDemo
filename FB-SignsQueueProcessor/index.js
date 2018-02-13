const FLOW = require('./../Common/constants').FLOW;
const COMPANY = require('./../Common/constants').COMPANY;
const EMPS = require('./../Common/constants').EMPS;
const utils = require('./../Common/utils');

module.exports = function (context, message) {
    var log = context.log;
    context.log('[signQ]: ', message);
    context.bindings.messageToSend = [];

    const askLocation = (expecting) => {
        context.bindings.messageToSend.push({
            to: message.sender,
            type: 2 // ask the location
        });
        context.bindings.userEvent = {
            userid: message.sender,
            empid: message.empid,
            flow: FLOW.SIGN,
            expecting,
        };
    }
    const processLocation = (signType) => {
        context.bindings.userEvent = {
            userid: message.sender,
            empid: message.empid,
            flow: FLOW.SIGN,
            expecting: 'nothing',
        };
        let distance = utils.calcDistance(message.location, COMPANY.location);
        const tzOffset = -350;
        if (signType) {
            let shift = COMPANY.shift[(signType === 'sign_in' ? 'start' : 'end')];
            let timeDiff = utils.calcTimeDiffInMinutes(message.timestamp, shift, tzOffset);
            context.bindings.messageToSend.push({
                to: message.sender,
                type: 1,
                text: `Thanks ${EMPS[message.empid].name},
                    \n${(signType === 'sign_in' ? 'Sign In' : 'Sign Out')} recorded successfully.
                    \nYou have signed ${utils.mod(timeDiff)} minutes ${(timeDiff > 0 ? 'late' : 'early')}, just ${distance} Meters away from the office.
                    \nHave a ${(signType === 'sign_in' ? 'Good Day' : 'Good Evening')}.\n
                    `
            });
            context.bindings.userEvent.sign = {
                type: signType,
                distance,
                timeDiff,
                shift,
                sentOn: message.timestamp,
                recordedOn: new Date().getTime()
            }
        } else {
            let timeDiff = {
                start: utils.calcTimeDiffInMinutes(message.timestamp, COMPANY.shift['start'], tzOffset),
                end: utils.calcTimeDiffInMinutes(message.timestamp, COMPANY.shift['end'], tzOffset),
            };
            context.bindings.messageToSend.push({
                to: message.sender,
                type: 1,
                text: `Thanks ${EMPS[message.empid].name}, 
                     \nI have recorded your sign. Please mention the tyoe of sign next time. Thanks.`
            });
            context.bindings.userEvent.sign = {
                type: 'unknown',
                guessedType: utils.mod(timeDiff.start) < utils.mod(timeDiff.end) ? 'sign_in' : 'sign_out',
                distance,
                timeDiff: timeDiff,
                sentOn: message.timestamp,
                recordedOn: new Date().getTime(),
            };
        }
    }
    const processSign = signType => {
        if (message.type === 'location') {
            processLocation(signType);
        } else {
            askLocation(signType);
        }
    }

    // user shared the location after we asked OR directly sent the location
    if (message.hasOwnProperty('lastEvent') && message.type === 'location') {
        let signType = message.lastEvent.expecting;
        // sign_in or sign_out
        if (utils.utter(signType, ['sign_in', 'sign_out'])) {
            processSign(signType);
        } else {
            // Do nothing
            log('[Do nothing]');
        }
    } else if (message.type === 'location') {
        // TODO: Identify is was a signin or signout
        processLocation();
    } else if (message.type === 'text') {
        // TODO: Ask the user's location
        if (utils.utter(message.text, ['signin', 'sign in', 'in', 'reached', 'reached work', 'checkin', 'check in'])) {
            askLocation('sign_in');
        } else if (utils.utter(message.text, ['signout', 'sign out', 'out', 'left', 'left work', 'checkout', 'check out'])) {
            askLocation('sign_out');
        } else {
            // Do nothing
            log('[Do nothing]');
        }
    }
    context.done();
};