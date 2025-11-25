import { Hyperbrowser } from "@hyperbrowser/sdk";
import 'dotenv/config';

const API_KEY = process.env.HYPERBROWSER_API_KEY;

export const setup = async () => {
  const client = new Hyperbrowser({
    apiKey: API_KEY,
  });
  const session = await client.sessions.create();

  return {
    browserWSEndpoint: session.wsEndpoint,
    provider: 'Hyperbrowser',
    session,
    client,
  };
}

export const teardown = async ({ session, client }) => {
  await client.sessions.stop(session.id);
}
