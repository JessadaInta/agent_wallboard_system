const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initSQLite, connectMongoDB } = require('./config/database');
const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agents');
const messageRoutes = require('./routes/messages');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

// ✅ WebSocket server
const io = socketio(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || ['*'],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Attach io object to req เพื่อใช้ broadcast ใน route ได้
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

app.use(errorHandler);

// ✅ WebSocket Logic
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });

  // ✅ เมื่อ agent เปลี่ยนสถานะจาก client
  socket.on('update_status', (data) => {
    console.log('🟢 Agent status updated:', data);
    // broadcast ไปทุกคนที่เชื่อมต่อ (รวม admin/supervisor)
    io.emit('agent_status_update', data);
  });
});

// ✅ Database and Server start
async function startServer() {
  try {
    console.log('🚀 Starting Agent Wallboard Backend...');
    await initSQLite();
    await connectMongoDB();

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server start failed:', err);
    process.exit(1);
  }
}

startServer();

module.exports = { app, io };
