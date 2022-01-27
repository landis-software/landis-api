const Landis = require("./index.js");
const auth = require("./example-auth.json");

const Client = new Landis.Forum(auth.XenForo.token);

Client.on("connected", () => {
  console.log("Connected to XenForo.")
  
  // Let's get Thread ID 5
  let myThread = new Landis.Thread(Client,5);
  
  myThread.on("setup", (data) => {
    console.log(data) // we gonna see the data :)
  })
})
