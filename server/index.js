const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Add this
const { OAuth2Client } = require('google-auth-library'); // Add this
const itemRoutes = require('./routes/items');
const { v2: cloudinary } = require('cloudinary');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Add this

// Enhanced CORS configuration
app.use(cors({
  origin: ["http://localhost:3000", "https://lost-found-portal-alpha.vercel.app"],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add this

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ================== Add Authentication Routes ==================
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Set secure cookie
    res.cookie('session', JSON.stringify({
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ success: true, user: payload });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
app.get("/", (req, res) => {
  res.send("Lost & Found API is live 🚀");
});

app.get('/api/auth/me', (req, res) => {
  try {
    const session = req.cookies.session;
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    
    // Add validation for session data
    const user = JSON.parse(session);
    if (!user.email || !user.name) {
      throw new Error('Invalid session data');
    }
    
    res.json({ user });
  } catch (err) {
    res.clearCookie('session');
    res.status(401).json({ error: 'Invalid session' });
  }
});


app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('session');
  res.json({ success: true });
});

// Existing routes
app.use('/api/items', itemRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection error:', err));
