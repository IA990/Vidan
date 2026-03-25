import express from 'express';
import { google } from 'googleapis';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.get('/api/auth/url', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.readonly'],
  });
  res.json({ url });
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
