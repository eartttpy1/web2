const jayson = require('jayson');
const client = jayson.client.http({ port: 3000 });

console.log("--- Starting Polling (Standard RPC) ---");

const params = {
  roomName: "Living Room",
  brightness: 85
};

console.log("--- Sending Command: toggleSmartLight ---");


client.request('toggleSmartLight', params, (err, response) => {
  if (err) return console.error("RPC Error:", err);
  
  if (response.error) {
    console.error("Server Error:", response.error.message);
  } else {
    console.log("Response:", response.result);
  }
});