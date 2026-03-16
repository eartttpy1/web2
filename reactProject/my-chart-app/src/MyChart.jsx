import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
];

function MyChart() {
  return (
    /* 1. สร้าง div มาคุมขนาดพื้นที่ที่ต้องการให้กราฟไปแสดง */
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      width: '100vw',
      backgroundColor: '#f5f5f5' // ใส่สีพื้นหลังให้อ่อนๆ จะได้เห็นขอบเขตกราฟชัดขึ้น
    }}>
      
      <div style={{ width: '80%', maxWidth: '800px', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MyChart;
