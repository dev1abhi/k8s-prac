const {v4 : uuidv4} = require('uuid')
const randomString = uuidv4();

setInterval(()=> 
console.log(`${new Date().toISOString()}: ${randomString}`), 5000);