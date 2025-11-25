import 'dotenv/config';

// API Key from Dashboard
const API_KEY = process.env.ANCHORBROWSER_API_KEY;

export const setup = async () => {
  return {
    browserWSEndpoint: `wss://connect.anchorbrowser.io?apiKey=${API_KEY}`,
    provider: 'Anchorbrowser',
  };
}

export const teardown = async () => { };
