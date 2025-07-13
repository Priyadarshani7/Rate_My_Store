require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('🚀 Server is running!');
  console.log(`📡 API available at: http://localhost:${port}`);
  console.log('-----------------------------------');
}); 