import { Router } from 'express';
import { db } from '../lib/db.js';

const router = Router();

router.get('/', async (req, res) => {
  const payouts = await db.collection('compensation').find();
  res.json(payouts.map(p => ({ ...p, id: p._id })));
});

router.post('/generate', async (req, res) => {
  const body = req.body as {
    period?: string;
    authors?: Array<{ id: string; baseRate: number; model: string }>;
    contentMetrics?: Array<{ authorId: string; reads: number; emojis: number }>;
  };
  
  const period = typeof body.period === 'string' ? body.period : '';
  const authors = Array.isArray(body.authors) ? body.authors : [];
  const contentMetrics = Array.isArray(body.contentMetrics) ? body.contentMetrics : [];
  
  const newPayouts = [];
  
  for (const author of authors) {
    const metrics = contentMetrics.filter(m => m.authorId === author.id);
    const totalReads = metrics.reduce((sum, m) => sum + (typeof m.reads === 'number' ? m.reads : 0), 0);
    const totalEmojis = metrics.reduce((sum, m) => sum + (typeof m.emojis === 'number' ? m.emojis : 0), 0);
    
    let base = 0;
    let bonus = 0;
    
    if (author.model === 'salary' || author.model === 'retainer') {
      base = typeof author.baseRate === 'number' ? author.baseRate : 0;
    } else {
      base = (typeof author.baseRate === 'number' ? author.baseRate : 0) * metrics.length;
    }
    
    bonus = (totalReads * 0.05) + (totalEmojis * 0.10);
    
    const payoutDoc = {
      authorId: String(author.id),
      period,
      baseAmount: base,
      bonusAmount: bonus,
      totalAmount: base + bonus,
      status: 'pending'
    };
    
    const id = await db.collection('compensation').insertOne(payoutDoc);
    const created = await db.collection('compensation').findById(id);
    if (created) {
      newPayouts.push({ ...created, id: created._id });
    }
  }
  
  res.status(201).json(newPayouts);
});

router.put('/:id/markPaid', async (req, res) => {
  const id = req.params.id;
  
  const ok = await db.collection('compensation').updateOne(id, { status: 'paid' });
  if (!ok) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  
  const updated = await db.collection('compensation').findById(id);
  if (!updated) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ ...updated, id: updated._id });
});

export default router;