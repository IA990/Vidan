const BASE_URL = "https://www.googleapis.com/youtube/v3";

function getApiKey() {
  const key = localStorage.getItem('YOUTUBE_API_KEY') || import.meta.env.VITE_YOUTUBE_API_KEY || "";
  if (!key) throw new Error("API key is missing. Please provide a valid API key.");
  return key;
}

export async function searchVideos(query: string) {
  const API_KEY = getApiKey();
  const response = await fetch(`${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&key=${API_KEY}`);
  const data = await response.json();
  return data.items || [];
}

export async function getVideoDetails(videoId: string) {
  const API_KEY = getApiKey();
  const response = await fetch(`${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${API_KEY}`);
  const data = await response.json();
  return data.items?.[0] || null;
}

export async function getChannelDetails(channelId: string) {
  const API_KEY = getApiKey();
  const response = await fetch(`${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`);
  const data = await response.json();
  return data.items?.[0] || null;
}
