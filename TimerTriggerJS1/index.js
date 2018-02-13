module.exports = function (context, myTimer) {
    var log = context.log;

    log('[myTimer] ',myTimer);
    var usersToRemind = context.bindings.messageToSend = [];

    var remindUser= (userid)=>{
        usersToRemind.push({
            to:userid,
            type:1,
            text:'Good Morning,\n\n Just reminding you to Sign In when you reach the office today. \nThanks.'
        });
    }

    var usersAvailable = context.bindings.usersAvailable;
    log('[usersAvailable] ',usersAvailable)
    var userSignedToday= context.bindings.userSignedToday;
    log('[userSignedToday] ',userSignedToday)


    var userSignedTodayMap = {};
    userSignedToday.forEach(element=>{
        if(!userSignedTodayMap.hasOwnProperty(element.empid)){
            userSignedTodayMap[element.empid] = true;
        }
    });
    usersAvailable.forEach(element=>{
        if(!userSignedTodayMap[element.empid]){
            log('Should send message to ',element)
            remindUser(element.userid);
        }
        //remindUser(element.userid);
    });
    context.done();
};