const Landis = require("./index.js");
const auth = require("./auth.json");

const Client = new Landis.Forum(auth.token);

console.log("Connected to XenForo.")

// Let's get Thread ID 5
let myThread = new Landis.ForumUser(Client, 4)

myThread.on("connected", (dat) => {
    console.log(dat);
})