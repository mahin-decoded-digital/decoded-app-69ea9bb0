import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContentStore } from '@/stores/contentStore';
import { useModerationStore } from '@/stores/moderationStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Flag, Play } from 'lucide-react';
import { EmojiRating } from '@/types';

const EMOJIS: { key: keyof EmojiRating; icon: string }[] = [
  { key: 'heart', icon: '❤️' },
  { key: 'fire', icon: '🔥' },
  { key: 'mind_blown', icon: '🤯' },
  { key: 'clap', icon: '👏' },
  { key: 'thinking', icon: '🤔' },
  { key: 'sad', icon: '😢' },
  { key: 'angry', icon: '😡' },
];

export default function ArticleView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = useContentStore(state => state.items.find(i => i.id === id));
  const addRating = useContentStore(state => state.addRating);
  const incrementRead = useContentStore(state => state.incrementRead);
  const addFlag = useModerationStore(state => state.addFlag);
  const user = useAuthStore(state => state.user);

  const [startTime] = useState(Date.now());
  const [flagReason, setFlagReason] = useState('');
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);

  useEffect(() => {
    if (!item) return;

    return () => {
      const timeSpent = Date.now() - startTime;
      if (id) {
        incrementRead(id, timeSpent);
      }
    };
  }, [id, item, startTime, incrementRead]);

  if (!id) {
    navigate('/');
    return null;
  }

  if (!item) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">Content not found</h2>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const handleFlag = () => {
    if (!flagReason.trim()) return;
    addFlag(item.id, flagReason, user?.id);
    setFlagDialogOpen(false);
    setFlagReason('');
  };

  return (
    <article className="max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={item.type === 'article' ? 'default' : 'secondary'} className="uppercase">
            {item.type}
          </Badge>
          {item.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="capitalize">{tag}</Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Published {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</span>
          </div>
          
          <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                <Flag className="h-4 w-4 mr-2" /> Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Content</DialogTitle>
                <DialogDescription>
                  Flag this content for review by our moderation team.
                </DialogDescription>
              </DialogHeader>
              <Textarea 
                placeholder="Reason for flagging (e.g., hate speech, copyright violation, spam)..." 
                value={flagReason}
                onChange={e => setFlagReason(e.target.value)}
                className="my-4"
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleFlag} disabled={!flagReason.trim()}>Submit Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {item.type === 'podcast' && item.audioUrl && (
        <div className="bg-muted p-6 rounded-lg mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button size="icon" className="rounded-full h-12 w-12 shrink-0">
              <Play className="h-6 w-6 ml-1" />
            </Button>
            <div>
              <div className="font-semibold">Listen to Episode</div>
              <div className="text-sm text-muted-foreground">
                {Math.floor((item.duration || 0) / 60)} mins
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        {item.body.split('\n').map((paragraph, i) => (
          <p key={i} className="mb-4">{paragraph}</p>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col items-center gap-4">
        <h3 className="font-semibold text-lg text-center">React to this piece</h3>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {EMOJIS.map(({ key, icon }) => (
            <Button
              key={key}
              variant="outline"
              size="lg"
              className="rounded-full px-4 flex items-center gap-2"
              onClick={() => addRating(item.id, key)}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-sm font-medium">{item.ratings[key]}</span>
            </Button>
          ))}
        </div>
      </div>
    </article>
  );
}
