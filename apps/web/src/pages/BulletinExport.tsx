import { useContentStore } from '@/stores/contentStore';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

export default function BulletinExport() {
  const user = useAuthStore(s => s.user);
  const items = useContentStore(state => state.items).filter(i => i.status === 'published' && i.type === 'article');

  if (!user || !['Founder', 'Editor'].includes(user.role)) return null;

  const handleExportPDF = () => {
    // In a real application, this would trigger a server-side PDF generation
    // or use a client-side library like jspdf. Here we simulate it.
    alert('Simulating PDF download of current published articles...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Print Bulletin Export</h1>
        <Button onClick={handleExportPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export PDF Bulletin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {item.title}
              </CardTitle>
              <CardDescription>{new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-4 text-sm text-muted-foreground">{item.body}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">Preview Layout</Button>
            </CardFooter>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            No published articles available for print export.
          </div>
        )}
      </div>
    </div>
  );
}