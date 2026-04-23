import { useModerationStore } from '@/stores/moderationStore';
import { useContentStore } from '@/stores/contentStore';
import { useAuthStore } from '@/stores/authStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';

export default function Moderation() {
  const user = useAuthStore(s => s.user);
  const flags = useModerationStore(state => state.flags);
  const updateFlagStatus = useModerationStore(state => state.updateFlagStatus);
  const items = useContentStore(state => state.items);
  const updateStatus = useContentStore(state => state.updateStatus);

  if (!user || !['Founder', 'Editor'].includes(user.role)) return null;

  const handleResolve = (flagId: string, contentId: string, action: 'dismiss' | 'takedown') => {
    updateFlagStatus(flagId, action === 'dismiss' ? 'dismissed' : 'resolved');
    if (action === 'takedown') {
      updateStatus(contentId, 'flagged');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Moderation Escalations</h1>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content Title</TableHead>
              <TableHead>Flag Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flags.map(flag => {
              const content = items.find(i => i.id === flag.contentId);
              return (
                <TableRow key={flag.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {content?.title || 'Deleted Content'}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{flag.reason}</TableCell>
                  <TableCell>{new Date(flag.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      flag.status === 'pending' ? 'destructive' :
                      flag.status === 'escalated' ? 'default' : 'secondary'
                    }>
                      {flag.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select 
                        value={flag.status} 
                        onValueChange={(v) => updateFlagStatus(flag.id, v as any)}
                      >
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="escalated">Escalate to Founder</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="dismissed">Dismissed</SelectItem>
                      </Select>
                      {flag.status === 'pending' && content && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleResolve(flag.id, flag.contentId, 'takedown')}
                        >
                          Takedown
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {flags.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  No moderation flags currently.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}