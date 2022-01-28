const Landis = require("./index.js");
const auth = require("./auth.json");

const Client = new Landis.Forum(auth.token);

console.log("Connected to XenForo.")

// Let's get Thread ID 5
let myThread = new Landis.Thread(Client, 5);

myThread.create();

/*myThread.on("setup", (data) => {
  console.log(myThread) // we gonna see the data :)
})*/