var moment = require('moment');

var round = n=> (Math.round(n*10)/10);
var distance = function(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "M") { dist = dist * 1.609344 * 1000 }
    if (unit == "N") { dist = dist * 0.8684 }
    return round(dist);
}

module.exports.calcDistance = function (cords, ideal) {
    return distance(cords.lat, cords.long, ideal.lat, ideal.long, "M");
}

module.exports.calcTimeDiffInMinutes  = function (now, ideal, tzOffset) {
    tzOffset = tzOffset || 0;
    var userTS = now; // 1513659945150;
    var now = moment(new Date());
    var end = moment(moment().format("DD:MM:YY") + " " + ideal, "DD:MM:YY HH:mm");
    var duration = moment.duration(now.diff(end));
    var diff = duration.asMinutes() + tzOffset;
    return Math.round(diff);
}

module.exports.mod = function (n){ return n>-1?n:n*(-1);}

module.exports.utter = function (word, toMatch) {
    console.log('[word] ', word)
    if (!word) return false;
    let w = word.toLowerCase();
    for (let item of toMatch) {
        if (w.indexOf(item.toLowerCase()) > -1) {
            return true;
        }
    }
    return false;
}
