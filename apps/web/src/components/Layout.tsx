import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuthStore } from '@/stores/authStore';
import { useContentStore } from '@/stores/contentStore';
import { useCompensationStore } from '@/stores/compensationStore';
import { useModerationStore } from '@/stores/moderationStore';

export function Layout() {
  const fetchMe = useAuthStore(s => s.fetchMe);
  const loaded = useAuthStore(s => s.loaded);
  
  const fetchItems = useContentStore(s => s.fetchItems);
  const fetchFlags = useModerationStore(s => s.fetchFlags);
  const fetchPayouts = useCompensationStore(s => s.fetchPayouts);

  useEffect(() => {
    fetchMe();
    fetchItems();
    fetchFlags();
    fetchPayouts();
  }, [fetchMe, fetchItems, fetchFlags, fetchPayouts]);

  if (!loaded) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const user = useAuthStore(s => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}