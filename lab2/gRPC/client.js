const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'crypto.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const cryptoProto = grpc.loadPackageDefinition(packageDefinition).crypto;

function main() {
    const client = new cryptoProto.CryptoService(
        'localhost:50051',
        grpc.credentials.createInsecure()
    );

    console.log("--- Calling Unary RPC ---");
    client.GetCurrentPrices({}, (err, response) => {
        if (err) return console.error(err);
        console.log(`Current BTC Price: ${response.value} at ${response.timestamp}`);
        
        startStreaming(client);
    });
}

function startStreaming(client) {
    console.log("\n--- Starting Server Streaming ---");
    const call = client.StreamPrices({});

    call.on('data', (response) => {
        console.log(`Price BTC Live Update: ${response.value} [${response.timestamp}]`);
    });

    call.on('error', (err) => {
        console.error("Stream Error:", err);
    });

    call.on('end', () => {
        console.log("Stream ended.");
    });
}

main();