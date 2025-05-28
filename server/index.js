const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const os = require('os');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Add trust proxy to get correct IP
app.set('trust proxy', true);

const transporter = nodemailer.createTransporter({
  service: 'Gmail',
  auth: {
    user: 'panthativishnu6248@gmail.com',
    pass: 'csrgwftzjjqbmnaf', // Consider using environment variables for security
  },
});

// 1. Regular email route
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await transporter.sendMail({
      from: 'panthativishnu6248@gmail.com',
      to,
      subject,
      text,
    });

    res.status(200).json({ message: 'Email sent!' });
  } catch (error) {
    console.error('Regular email error:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

// 2. Server info email route (FIXED)
app.post('/send-server-info-email', async (req, res) => {
  console.log('Server info email route hit'); // Debug log
  
  const { to } = req.body;
  
  if (!to) {
    return res.status(400).json({ error: 'Email recipient is required' });
  }

  try {
    const uptime = process.uptime(); // in seconds
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);
    
    // Get IP address more reliably
    const ip = req.headers['x-forwarded-for'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
               'Unknown';
    
    const hostname = os.hostname();
    const currentTime = new Date().toLocaleString();
    const memoryUsage = process.memoryUsage();
    const platform = os.platform();
    const arch = os.arch();
    const totalMemory = os.totalmem() / 1024 / 1024; // in MB
    const freeMemory = os.freemem() / 1024 / 1024; // in MB

    const message = `
Server Info Report:

⏱ Uptime: ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s
🕒 Timestamp: ${currentTime}
🖥 Hostname: ${hostname}
🌐 Client IP: ${ip}
💻 Platform: ${platform} (${arch})
🧠 Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
📊 Total Memory: ${totalMemory.toFixed(2)} MB
🆓 Free Memory: ${freeMemory.toFixed(2)} MB
🔧 Node.js Version: ${process.version}
    `;

    console.log('Attempting to send server info email...'); // Debug log

    const result = await transporter.sendMail({
      from: 'panthativishnu6248@gmail.com',
      to,
      subject: '📊 Server Runtime Info',
      text: message.trim(),
    });

    console.log('Server info email sent successfully:', result.messageId); // Debug log
    res.status(200).json({ message: 'Server info email sent!', messageId: result.messageId });
    
  } catch (error) {
    console.error('Server info email error:', error);
    res.status(500).json({ 
      error: 'Failed to send server info email',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
  console.log('Available endpoints:');
  console.log('- POST /send-email');
  console.log('- POST /send-server-info-email');
  console.log('- GET /health');
});