import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useContentStore } from '@/stores/contentStore';
import { ContentType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';

export default function SubmitContent() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const addItem = useContentStore(state => state.addItem);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<ContentType>('article');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addItem({
      title,
      body,
      type,
      status: 'draft',
      authorId: user.id,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      syndicationAllowed: true,
    });

    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Submit Content</CardTitle>
          <CardDescription>Draft a new article, podcast show notes, or video description. It will enter the editorial queue.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as ContentType)}>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="podcast">Podcast Episode</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="bulletin">Print Bulletin</SelectItem>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Enter a compelling title"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>Body / Show Notes</Label>
              <Textarea 
                value={body} 
                onChange={e => setBody(e.target.value)} 
                placeholder="Write your content here. A WYSIWYG editor would normally be here."
                className="min-h-[300px]"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input 
                value={tags} 
                onChange={e => setTags(e.target.value)} 
                placeholder="racing, thoroughbred, breeding"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit">Save as Draft</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
