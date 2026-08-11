import 'dotenv/config';

// API Key from Dashboard
const API_KEY = process.env.ANCHORBROWSER_API_KEY;

export const setup = async () => {
  const res = await fetch('https://api.anchorbrowser.io/v1/sessions', {
    method: 'POST',
    headers: {
      'anchor-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    throw new Error(`anchorbrowser session create failed: ${res.status} ${await res.text()}`);
  }
  const { data } = await res.json();

  return {
    browserWSEndpoint: data.cdp_url,
    provider: 'Anchorbrowser',
    sessionId: data.id,
  };
}

export const teardown = async ({ sessionId }) => {
  await fetch(`https://api.anchorbrowser.io/v1/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: { 'anchor-api-key': API_KEY },
  });
};
