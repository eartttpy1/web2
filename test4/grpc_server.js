const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// โหลดไฟล์ .proto
const PROTO_PATH = path.join(__dirname, 'protos', 'inventory.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const inventoryProto = grpc.loadPackageDefinition(packageDefinition).inventory;

// Implementation ของ Service
function streamBookPrice(call) {
    const bookId = call.request.bookId;
    console.log(`Starting stream for Book ID: ${bookId}`);

    // ส่งข้อมูลราคาแบบสุ่มทุกๆ 2 วินาที
    const timer = setInterval(() => {
        const priceUpdate = {
            price: (Math.random() * (500 - 100) + 100).toFixed(2), // สุ่มราคา 100-500
            timestamp: new Date().toISOString()
        };
        
        call.write(priceUpdate);
    }, 2000);

    // เมื่อ Client ปิดการเชื่อมต่อ
    call.on('cancelled', () => {
        clearInterval(timer);
        console.log(`Stream for Book ID: ${bookId} cancelled.`);
    });
}

function main() {
    const server = new grpc.Server();
    server.addService(inventoryProto.PriceService.service, {
        streamBookPrice: streamBookPrice
    });

    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log('gRPC Inventory Service running at http://localhost:50051');
    });
}

main();