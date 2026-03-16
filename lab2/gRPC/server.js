const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'crypto.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const cryptoProto = grpc.loadPackageDefinition(packageDefinition).crypto;

// Implementation of the RPC methods
const GetCurrentPrices = (call, callback) => {
    const response = {
        value: parseFloat((Math.random() * (35000 - 25000) + 25000).toFixed(2)),
        timestamp: new Date().toLocaleTimeString()
    };
    callback(null, response); 
};


const StreamPrices = (call) => {
    console.log("Client connected for streaming...");
    
    const interval = setInterval(() => {
        const response = {
            value: (Math.random() * (35000 - 25000) + 25000).toFixed(2),
            timestamp: new Date().toLocaleTimeString()
        };
        call.write(response);
    }, 500);

    call.on('cancelled', () => {
        console.log("Streaming cancelled by client.");
        clearInterval(interval);
    });
};
function main() {
    const server = new grpc.Server();
    server.addService(cryptoProto.CryptoService.service, {
        GetCurrentPrices: GetCurrentPrices,
        StreamPrices: StreamPrices
    });

    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) return console.error(err);
        console.log(`Server running at http://0.0.0.0:${port}`);
    });
}

main();