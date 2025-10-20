const express = require('express');
const cors = require('cors');
const agentsRoutes = require('./routes/agents');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/agents', agentsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
