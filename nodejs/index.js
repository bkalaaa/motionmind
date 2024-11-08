const cors = require('cors');
require('dotenv').config();
const express = require('express');
const path = require('path');
const generateVideo = require('./routes/generateVideo');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Video generation route
app.use('/api/generateVideo', generateVideo);
// Video storage route
app.use('/videos', express.static(path.join(__dirname, 'public', 'videos')));
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});