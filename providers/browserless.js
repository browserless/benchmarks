import 'dotenv/config';

const API_KEY = process.env.BROWSERLESS_API_KEY;

export const setup = async () => {
  return {
    browserWSEndpoint: `wss://production-sfo.browserless.io/?token=${API_KEY}`,
    provider: 'Browserless',
  };
}

export const teardown = async () => { }
