import { Browserbase } from '@browserbasehq/sdk';
import 'dotenv/config';

const API_KEY = process.env.BROWSERBASE_API_KEY;
const PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;

export const setup = async () => {
  const bb = new Browserbase({ apiKey: API_KEY });
  const session = await bb.sessions.create({
    projectId: PROJECT_ID,
  });

  return {
    browserWSEndpoint: session.connectUrl,
    provider: 'Browserbase',
  };
}

export const teardown = async () => { }
