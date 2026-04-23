import { Router } from 'express';
import { db } from '../lib/db.js';

const router = Router();

router.get('/', async (req, res) => {
  const flags = await db.collection('moderation').find();
  res.json(flags.map(f => ({ ...f, id: f._id })));
});

router.post('/', async (req, res) => {
  const body = req.body as { contentId?: string; reason?: string; reportedBy?: string };
  
  const newFlag = {
    contentId: typeof body.contentId === 'string' ? body.contentId : '',
    reason: typeof body.reason === 'string' ? body.reason : '',
    status: 'pending',
    reportedBy: typeof body.reportedBy === 'string' ? body.reportedBy : undefined,
    createdAt: new Date().toISOString(),
  };
  
  const id = await db.collection('moderation').insertOne(newFlag);
  const created = await db.collection('moderation').findById(id);
  
  if (!created) {
    res.status(500).json({ error: 'Failed to create' });
    return;
  }
  
  res.status(201).json({ ...created, id: created._id });
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body as { status?: string };
  const status = body.status;
  
  if (!status || typeof status !== 'string') {
    res.status(400).json({ error: 'Status required' });
    return;
  }
  
  const ok = await db.collection('moderation').updateOne(id, { status });
  if (!ok) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  
  const updated = await db.collection('moderation').findById(id);
  if (!updated) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ ...updated, id: updated._id });
});

export default router;