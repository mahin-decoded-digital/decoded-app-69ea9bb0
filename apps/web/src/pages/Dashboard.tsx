import { useAuthStore } from '@/stores/authStore';
import { useContentStore } from '@/stores/contentStore';
import { useCompensationStore } from '@/stores/compensationStore';
import { useModerationStore } from '@/stores/moderationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, FileText, AlertCircle, DollarSign, Activity, Eye, Play, Printer } from 'lucide-react';

export default function Dashboard() {
  const user = useAuthStore(s => s.user);
  const contentItems = useContentStore(state => state.items);
  const payouts = useCompensationStore(state => state.payouts);
  const flags = useModerationStore(state => state.flags);

  if (!user) return null;

  const isManagement = ['Founder', 'Editor'].includes(user.role);

  // Author specific stats
  const authorItems = contentItems.filter(i => i.authorId === user.id);
  const authorReads = authorItems.reduce((sum, item) => sum + item.reads, 0);
  const authorPayouts = payouts.filter(p => p.authorId === user.id);
  const totalEarned = authorPayouts.reduce((sum, p) => sum + p.totalAmount, 0);

  // Global stats
  const pendingFlags = flags.filter(f => f.status === 'pending').length;
  const inReview = contentItems.filter(i => i.status === 'editor-review' || i.status === 'peer-review').length;
  const publishedCount = contentItems.filter(i => i.status === 'published').length;
  const totalReads = contentItems.reduce((sum, i) => sum + i.reads, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
        {user.role === 'Contributor' && (
          <Button asChild>
            <Link to="/submit">Submit Content</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isManagement ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published Content</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedCount}</div>
                <p className="text-xs text-muted-foreground">{inReview} items in review queue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Reads</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReads.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all publications</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Moderation Queue</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingFlags}</div>
                <p className="text-xs text-muted-foreground">Pending flags require review</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Publications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{authorItems.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reads</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{authorReads.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Drives your engagement bonus</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalEarned.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{authorPayouts.length} payout periods</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(isManagement ? contentItems : authorItems).slice(0, 5).map(item => (
                <div key={item.id} className="flex flex-col gap-1 border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate pr-4">{item.title}</span>
                    <span className="text-xs uppercase bg-muted px-2 py-1 rounded">{item.status}</span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-4">
                    <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {item.reads}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {isManagement && (
              <>
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/editorial"><FileText className="mr-2 h-4 w-4" /> Editorial Queue</Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/moderation"><AlertCircle className="mr-2 h-4 w-4" /> Moderation Escalations</Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/payouts"><DollarSign className="mr-2 h-4 w-4" /> Contributor Payouts</Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/podcast"><Play className="mr-2 h-4 w-4" /> Podcast Manager</Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/bulletin"><Printer className="mr-2 h-4 w-4" /> Print Bulletin Export</Link>
                </Button>
              </>
            )}
            {!isManagement && (
              <>
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/submit"><FileText className="mr-2 h-4 w-4" /> Submit New Draft</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}