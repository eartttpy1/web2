const jayson = require('jayson');

const server = jayson.server({
  
  toggleSmartLight: function(args, callback) {
   
    const roomName = args.roomName || args[0];
    const brightness = args.brightness || args[1];

    if (!roomName || brightness === undefined) {
      return callback({ 
        code: -32602, 
        message: "Invalid params: roomName and brightness are required"
      });
    }
    
    if (brightness < 0 || brightness > 100) {
      return callback({
        code: -32001, 
        message: "Invalid input."
      })
    }
    
    const message = `Light in ${roomName} set to ${brightness}%`;
    callback(null, message);
  }
});

server.http().listen(3000, () => {
  console.log("Smart Home JSON-RPC Server running on port 3000");
});