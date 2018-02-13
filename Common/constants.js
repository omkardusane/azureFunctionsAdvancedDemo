const FLOW = {
    NEW_USER: 1,
    SIGN: 2,
}
const EMPS = {
    'CS101': {
        name: 'John Mayer',
        age: '28'
    },
    'CS102': {
        name: 'Jane Ross',
        age: '29'
    },
    'ME101': {
        name: 'Kim Harvey',
        age: '27'
    },
}
const COMPANY = {
    greeting: 'Hi, I am your friend, the Presence Bot.\n Glad you messaged me. I am here to help you record your attendance with us.',
    shift:{
        start:'10:00',
        end:'18:00'
    },
	location:{
		 lat: 19.164746, 
         long: 72.937737
	}
}
module.exports = {
	FLOW,
	EMPS,
	COMPANY
}

