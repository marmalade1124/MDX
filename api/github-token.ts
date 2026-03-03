import { verifyToken, createClerkClient } from '@clerk/backend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Extract the Clerk session token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const sessionToken = authHeader.split(' ')[1];

    // 3. Verify the token securely using Clerk's Backend SDK
    const verifiedSession = await verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!verifiedSession.sub) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    const userId = verifiedSession.sub;

    // 4. Request the real GitHub OAuth token from Clerk
    // The provider name is 'oauth_github'
    const oauthTokens = await clerk.users.getUserOauthAccessToken(userId, 'oauth_github');
    
    // 5. Ensure the user actually has a GitHub token linked
    if (!oauthTokens || oauthTokens.data.length === 0) {
      return res.status(404).json({ error: 'No GitHub account linked to this user' });
    }

    // 6. Return the real GitHub token to our frontend!
    const githubToken = oauthTokens.data[0].token;
    return res.status(200).json({ token: githubToken });

  } catch (error: any) {
    console.error('API Error exchanging Clerk token:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
