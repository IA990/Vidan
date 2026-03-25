import express from 'express';
import { google } from 'googleapis';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialisation Firebase Admin
// Note: In a real environment, you'd use a service account key or default credentials
const adminApp = initializeApp();
const db = getFirestore(adminApp);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  `${process.env.APP_URL}/auth/callback`
);

// Middleware de protection
const checkAuth = async (req: any, res: any, next: any) => {
  const tokens = req.cookies.youtube_tokens;
  if (!tokens) return res.status(401).json({ error: 'Connexion requise' });
  
  try {
    const parsedTokens = JSON.parse(tokens);
    if (!parsedTokens.refresh_token) {
        res.clearCookie('youtube_tokens', { httpOnly: true, secure: true, sameSite: 'none' });
        return res.status(401).json({ error: 'Refresh token missing, please re-authenticate' });
    }
    oauth2Client.setCredentials(parsedTokens);
    // On récupère l'ID utilisateur pour Firestore
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const channel = await youtube.channels.list({ part: ['id'], mine: true });
    req.userId = channel.data.items?.[0].id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Session expirée' });
  }
};

// Endpoint avec limite de 3/jour
app.post('/api/generate-strategy', checkAuth, async (req: any, res: any) => {
  const userRef = db.collection('usage').doc(req.userId);
  const doc = await userRef.get();
  const today = new Date().toDateString();

  let userData = doc.exists ? doc.data() : { count: 0, lastDate: today };

  // Reset si nouvelle journée
  if (userData!.lastDate !== today) {
    userData = { count: 0, lastDate: today };
  }

  if (userData!.count >= 3) {
    return res.status(429).json({ 
      error: "Limite atteinte", 
      message: "Vous avez utilisé vos 3 analyses gratuites du jour." 
    });
  }

  // Usage tracking
  await userRef.set({
    count: userData!.count + 1,
    lastDate: today
  }, { merge: true });

  res.json({ remaining: 3 - (userData!.count + 1) });
});

app.get('/api/auth/url', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.readonly'],
    prompt: 'consent',
  });
  res.json({ url });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('youtube_tokens', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ message: 'Logged out' });
});

app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    res.cookie('youtube_tokens', JSON.stringify(tokens), { httpOnly: true, secure: true, sameSite: 'none' });
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
});

app.get('/api/channel', async (req, res) => {
  const tokens = req.cookies.youtube_tokens;
  if (!tokens) return res.status(401).send('Not authenticated');
  
  oauth2Client.setCredentials(JSON.parse(tokens));
  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
  
  try {
    const response = await youtube.channels.list({
      part: ['snippet', 'contentDetails'],
      mine: true,
    });
    res.json(response.data.items?.[0]);
  } catch (error) {
    console.error('YouTube API Error:', error);
    res.status(500).send('Failed to fetch channel');
  }
});

// Community Management Endpoints
let autoReplyEnabled = false;

app.post('/api/community/auto-reply', (req, res) => {
  autoReplyEnabled = req.body.enabled;
  res.json({ enabled: autoReplyEnabled });
});

app.get('/api/community/analytics', (req, res) => {
  res.json({
    views: 1250,
    likes: 340,
    comments: 85,
    subscribers: 12
  });
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
