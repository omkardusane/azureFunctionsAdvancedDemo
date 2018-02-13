var log = () => { };
module.exports = function (context, req) {
    log = context.log;
    context.res = { status: 200 }; 
    let body = req.body;
    if (!body) {
        context.done();
        return;
    }
    context.bindings.receivedMessage = [];
    handle(body, function (sender, msg, timestamp) {
        log('[LOG] We have a message from  ', sender, ': ');
        context.bindings.receivedMessage.push({
            sender,
            timestamp,
            payload:msg
        })
    });
    context.done();
};

function handle(body, cb) {
    if (body.object == 'page' && body.entry.length) {
        for (let e of body.entry) {
            if (e.hasOwnProperty('messaging') && e.messaging.length) {
                for (let em of e.messaging) {
                    if (em.sender && em.message) {
                        cb(em.sender.id, em.message, em.timestamp);
                    }
                }
            }
        }
    }
}