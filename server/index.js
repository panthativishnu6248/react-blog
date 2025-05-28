const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const os = require('os');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'panthativishnu6248@gmail.com',
    pass: 'csrgwftzjjqbmnaf',
  },
});

// 1. Regular email route
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await transporter.sendMail({
      from: 'panthativishnu6248@gmail.com',
      to,
      subject ,
      text ,
    });

    res.status(200).send('Email sent!');
  } catch (error) {
    console.error('Regular email error:', error);
    res.status(500).send('Error sending email');
  }
});

// 2. Server info email route
app.post('/send-server-info-email', async (req, res) => {
  const { to } = req.body;

  const uptime = process.uptime(); // in seconds
  const ip = req.ip || req.connection.remoteAddress;
  const hostname = os.hostname();
  const currentTime = new Date().toLocaleString();
  const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // in MB

  const message = `
    Server Info Report:

    ⏱ Uptime: ${Math.floor(uptime)} seconds
    🕒 Timestamp: ${currentTime}
    🖥 Hostname: ${hostname}
    🌐 IP Address: ${ip}
    🧠 Memory Usage: ${memoryUsage.toFixed(2)} MB
  `;

  try {
    await transporter.sendMail({
      from: 'panthativishnu6248@gmail.com',
      to,
      subject: '📊 Server Runtime Info',
      text: message,
    });

    res.status(200).send('Server info email sent!');
  } catch (error) {
    console.error('Server info email error:', error);
    res.status(500).send('Failed to send server info email');
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
