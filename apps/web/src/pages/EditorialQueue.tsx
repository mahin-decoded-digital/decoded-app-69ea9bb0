import { useState } from 'react';
import { useContentStore } from '@/stores/contentStore';
import { useAuthStore } from '@/stores/authStore';
import { ContentStatus } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

const STATUS_ORDER: ContentStatus[] = ['draft', 'peer-review', 'editor-review', 'copyedit', 'published', 'flagged'];

export default function EditorialQueue() {
  const user = useAuthStore(s => s.user);
  const items = useContentStore(state => state.items);
  const updateStatus = useContentStore(state => state.updateStatus);
  const updateItem = useContentStore(state => state.updateItem);
  const [filter, setFilter] = useState<ContentStatus | 'all'>('all');

  const [activeItem, setActiveItem] = useState<string | null>(null);

  if (!user || !['Founder', 'Editor'].includes(user.role)) return null;

  const filteredItems = items.filter(i => filter === 'all' ? true : i.status === filter)
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));

  const handlePublish = (id: string) => {
    updateItem(id, { complianceChecked: true });
    updateStatus(id, 'published');
    setActiveItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Editorial Queue</h1>
        <div className="w-48">
          <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="peer-review">Peer Review</SelectItem>
            <SelectItem value="editor-review">Editor Review</SelectItem>
            <SelectItem value="copyedit">Copyedit</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </Select>
        </div>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium max-w-[200px] truncate">{item.title}</TableCell>
                <TableCell className="capitalize">{item.type}</TableCell>
                <TableCell>
                  <Badge variant={
                    item.status === 'published' ? 'default' : 
                    item.status === 'flagged' ? 'destructive' : 'secondary'
                  }>
                    {item.status.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={item.status} 
                      onValueChange={(v) => {
                        if (v === 'published' && !item.complianceChecked) {
                          setActiveItem(item.id);
                        } else {
                          updateStatus(item.id, v as ContentStatus);
                        }
                      }}
                    >
                      {STATUS_ORDER.map(status => (
                        <SelectItem key={status} value={status}>Move to {status}</SelectItem>
                      ))}
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  No items match the filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Compliance Check Dialog before publishing */}
      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pre-Publish Compliance Check</DialogTitle>
            <DialogDescription>
              Review the media law and syndication policies before publishing this content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="c1" className="rounded" defaultChecked />
              <label htmlFor="c1">Copyright ownership & attribution verified</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="c2" className="rounded" defaultChecked />
              <label htmlFor="c2">No defamation or hate speech detected</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="c3" className="rounded" defaultChecked />
              <label htmlFor="c3">Racing bureaucracy data accurately cited</label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => activeItem && handlePublish(activeItem)}>Agree & Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}