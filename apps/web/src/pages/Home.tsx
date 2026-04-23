import { Link } from 'react-router-dom';
import { useContentStore } from '@/stores/contentStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, BookOpen } from 'lucide-react';

export default function Home() {
  const items = useContentStore(state => state.items).filter(i => i.status === 'published');

  if (!items || items.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">No published content yet</h2>
        <p className="text-muted-foreground">Check back later for new articles and podcasts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-4xl font-bold">Latest on Stable Press</h1>
        <p className="text-xl text-muted-foreground">The premier source for thoroughbred racing insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(item => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={item.type === 'article' ? 'default' : 'secondary'}>
                  {item.type.toUpperCase()}
                </Badge>
                {item.tags?.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="capitalize">{tag}</Badge>
                ))}
              </div>
              <CardTitle className="line-clamp-2">
                <Link to={`/content/${item.id}`} className="hover:underline">
                  {item.title}
                </Link>
              </CardTitle>
              <CardDescription>
                {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="line-clamp-3 text-muted-foreground">{item.body}</p>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground flex items-center justify-between">
              <div className="flex items-center gap-4">
                {item.type === 'article' && (
                  <span className="flex items-center gap-1"><BookOpen className="h-4 w-4"/> Read</span>
                )}
                {item.type === 'podcast' && (
                  <span className="flex items-center gap-1"><Play className="h-4 w-4"/> Listen</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {Math.max(1, Math.ceil(item.body.length / 500))} min
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
