import { useContentStore } from '@/stores/contentStore';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {Play, Star} from 'lucide-react';

export default function PodcastManager() {
  const user = useAuthStore(s => s.user);
  const items = useContentStore(state => state.items).filter(i => i.type === 'podcast');

  if (!user || !['Founder', 'Editor'].includes(user.role)) return null;

  const handleGenerateRSS = () => {
    // In a real app this would call an API or generate an XML blob
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Stable Press Podcast</title>
    ${items.filter(i => i.status === 'published').map(i => `
    <item>
      <title>${i.title}</title>
      <link>${i.audioUrl}</link>
      <description>${i.showNotes || i.body}</description>
    </item>`).join('\n')}
  </channel>
</rss>`;
    
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feed.xml';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Podcast Manager</h1>
        <Button onClick={handleGenerateRSS} className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Export RSS Feed
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Episodes</CardTitle>
          <CardDescription>Manage your podcast episodes and show notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Listens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-muted-foreground" />
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{Math.floor((item.duration || 0) / 60)} mins</TableCell>
                  <TableCell>{item.reads}</TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                    No podcast episodes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}