import { Router } from 'express';
import { db, Doc as DbDoc } from '../lib/db';

// Use DbDoc from db.ts directly and extend with additional fields
// to keep type compatibility while extending

type Doc = DbDoc & {
  email: string;
  name?: string;
  role?: string;
  compensationModel?: string;
  baseRate?: number;
  token?: string;
};

const router = Router();

router.post('/login', async (req, res) => {
  const body = req.body as { email?: string; name?: string; role?: string; compensationModel?: string; baseRate?: number };
  const email = body.email;
  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email required' });
    return;
  }

  const users = await db.collection('users').find({ email });
  let user: Doc | null = users[0] ?? null;

  if (!user) {
    const id = await db.collection('users').insertOne({ ...body, token: Math.random().toString(36).substring(2) });
    const newUser = await db.collection('users').findById(id);
    user = newUser ?? null;
  }

  if (!user) {
    res.status(500).json({ error: 'Failed to create user' });
    return;
  }

  const token = typeof user.token === 'string' ? user.token : Math.random().toString(36).substring(2);
  if (!user.token) {
    await db.collection('users').updateOne(user._id, { token });
  }

  res.json({ user, token });
});

router.get('/me', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const users = await db.collection('users').find({ token });
  const user: Doc | null = users[0] ?? null;
  if (!user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  res.json({ user });
});

export default router;