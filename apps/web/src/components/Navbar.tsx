import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/ui/avatar';
import { Zap } from 'lucide-react';

export default function Navbar() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Zap className="h-6 w-6" />
            Stable Press
          </Link>
          
          {user && (
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              {['Founder', 'Editor'].includes(user.role) && (
                <>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
                  <Link to="/editorial" className="text-muted-foreground hover:text-foreground">Editorial</Link>
                  <Link to="/moderation" className="text-muted-foreground hover:text-foreground">Moderation</Link>
                </>
              )}
              {user.role === 'Contributor' && (
                <Link to="/submit" className="text-muted-foreground hover:text-foreground">Submit Content</Link>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar fallback={user.name.charAt(0)} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b mb-1">
                  {user.name} ({user.role})
                </div>
                <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}