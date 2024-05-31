// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.database_url);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.json());

// Routes
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/user');

app.use('/events', eventRoutes);
app.use('/users', userRoutes);



app.get('/', (req, res) => {
  res.send('Welcome to Tutor Calendar API');
});

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

app.get('/auth/google', (req, res) => {
  const userEmail = req.query.email; 
 
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    login_hint: userEmail
  });

  res.redirect(url);
});

const User = require('./models/User');

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });

    const { data } = await oauth2.userinfo.get();
    const userEmail = data.email;

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { googleTokens: tokens },
      { new: true, upsert: true }
    );

    res.status(200).send('Authentication successful! You can close this tab.');
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.status(500).send('Error during authentication');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
