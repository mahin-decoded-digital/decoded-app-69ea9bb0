import { Router } from 'express';
import { db } from '../lib/db.js';

const router = Router();

router.get('/', async (req, res) => {
  const items = await db.collection('content').find();
  res.json(items.map(item => ({...item, id: item._id})));
});

router.post('/', async (req, res) => {
  const body = req.body as Record<string, unknown>;
  
  const newItem = {
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reads: 0,
    timeOnPage: 0,
    ratings: { heart: 0, fire: 0, mind_blown: 0, clap: 0, thinking: 0, sad: 0, angry: 0 },
    complianceChecked: false,
  };
  
  const id = await db.collection('content').insertOne(newItem);
  const created = await db.collection('content').findById(id);
  
  if (!created) {
    res.status(500).json({ error: 'Failed to create' });
    return;
  }
  
  res.status(201).json({ ...created, id: created._id });
});

router.put('/:id', async (req, res) => {
  const body = req.body as Record<string, unknown>;
  const id = req.params.id;
  
  const updates = {
    ...body,
    updatedAt: new Date().toISOString(),
  };
  
  const ok = await db.collection('content').updateOne(id, updates);
  if (!ok) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  
  const updated = await db.collection('content').findById(id);
  if (!updated) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ ...updated, id: updated._id });
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const ok = await db.collection('content').deleteOne(id);
  if (!ok) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ success: true });
});

router.put('/:id/status', async (req, res) => {
  const id = req.params.id;
  const body = req.body as { status?: string };
  const status = body.status;
  
  if (!status || typeof status !== 'string') {
    res.status(400).json({ error: 'Status required' });
    return;
  }
  
  const item = await db.collection('content').findById(id);
  if (!item) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  
  const updates: Record<string, unknown> = {
    status,
    updatedAt: new Date().toISOString(),
  };
  
  if (status === 'published' && !item.publishedAt) {
    updates.publishedAt = new Date().toISOString();
  }
  
  await db.collection('content').updateOne(id, updates);
  const updated = await db.collection('content').findById(id);
  
  if (!updated) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ ...updated, id: updated._id });
});

router.put('/:id/rating', async (req, res) => {
  const id = req.params.id;
  const body = req.body as { emoji?: string };
  const emoji = body.emoji;
  
  if (!emoji || typeof emoji !== 'string') {
    res.status(400).json({ error: 'Emoji required' });
    return;
  }
  
  const item = await db.collection('content').findById(id);
  if (!item) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  
  const currentRatings = (item.ratings as Record<string, number>) || {};
  const currentVal = typeof currentRatings[emoji] === 'number' ? currentRatings[emoji] : 0;
  
  const newRatings = {
    ...currentRatings,
    [emoji]: currentVal + 1
  };
  
  await db.collection('content').updateOne(id, { ratings: newRatings });
  const updated = await db.collection('content').findById(id);
  
  if (!updated) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ ...updated, id: updated._id });
});

router.put('/:id/read', async (req, res) => {
  const id = req.params.id;
  const body = req.body as { timeSpent?: number };
  const timeSpent = typeof body.timeSpent === 'number' ? body.timeSpent : 0;
  
  const item = await db.collection('content').findById(id);
  if (!item) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  
  const currentReads = typeof item.reads === 'number' ? item.reads : 0;
  const currentTimeOnPage = typeof item.timeOnPage === 'number' ? item.timeOnPage : 0;
  
  await db.collection('content').updateOne(id, {
    reads: currentReads + 1,
    timeOnPage: currentTimeOnPage + timeSpent
  });
  
  const updated = await db.collection('content').findById(id);
  
  if (!updated) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ ...updated, id: updated._id });
});

export default router;