import { useState } from 'react';
import { useCompensationStore } from '@/stores/compensationStore';
import { useContentStore } from '@/stores/contentStore';
import { useAuthStore } from '@/stores/authStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Payouts() {
  const user = useAuthStore(s => s.user);
  const payouts = useCompensationStore(state => state.payouts);
  const markPaid = useCompensationStore(state => state.markPaid);
  const generatePayouts = useCompensationStore(state => state.generatePayouts);
  const contentItems = useContentStore(state => state.items);

  const [period, setPeriod] = useState('2023-11');

  if (!user || !['Founder', 'Editor'].includes(user.role)) return null;

  const handleGenerate = () => {
    // Mocking authors in the system based on content
    const authors = Array.from(new Set(contentItems.map(i => i.authorId))).map(id => ({
      id,
      baseRate: 100, // mock
      model: 'per-article' // mock
    }));

    const metrics = contentItems.map(i => ({
      authorId: i.authorId,
      reads: i.reads,
      emojis: Object.values(i.ratings).reduce((a, b) => a + b, 0)
    }));

    generatePayouts(period, authors, metrics);
  };

  const totalPending = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compensation & Payouts</h1>
        <Button onClick={handleGenerate}>Run Payouts for {period}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author ID</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Base</TableHead>
              <TableHead>Engagement Bonus</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map(payout => (
              <TableRow key={payout.id}>
                <TableCell className="font-medium">{payout.authorId}</TableCell>
                <TableCell>{payout.period}</TableCell>
                <TableCell>${payout.baseAmount.toFixed(2)}</TableCell>
                <TableCell>${payout.bonusAmount.toFixed(2)}</TableCell>
                <TableCell className="font-bold">${payout.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={payout.status === 'paid' ? 'default' : 'secondary'}>
                    {payout.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {payout.status === 'pending' && (
                    <Button size="sm" onClick={() => markPaid(payout.id)}>Mark Paid</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {payouts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                  No payout records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}