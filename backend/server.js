import { createRequire } from 'module';

const require = createRequire(import.meta.url);
require('dotenv').config();

import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});