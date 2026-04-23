import { Routes, Route } from 'react-router-dom';
import { Layout, ProtectedRoute } from '@/components/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import ArticleView from '@/pages/ArticleView';
import SubmitContent from '@/pages/Submit';
import EditorialQueue from '@/pages/EditorialQueue';
import Moderation from '@/pages/Moderation';
import Payouts from '@/pages/Payouts';
import PodcastManager from '@/pages/PodcastManager';
import BulletinExport from '@/pages/BulletinExport';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/content/:id" element={<ArticleView />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/submit" element={
          <ProtectedRoute allowedRoles={['Contributor', 'Founder', 'Editor']}>
            <SubmitContent />
          </ProtectedRoute>
        } />
        <Route path="/editorial" element={
          <ProtectedRoute allowedRoles={['Founder', 'Editor']}>
            <EditorialQueue />
          </ProtectedRoute>
        } />
        <Route path="/moderation" element={
          <ProtectedRoute allowedRoles={['Founder', 'Editor']}>
            <Moderation />
          </ProtectedRoute>
        } />
        <Route path="/payouts" element={
          <ProtectedRoute allowedRoles={['Founder', 'Editor']}>
            <Payouts />
          </ProtectedRoute>
        } />
        <Route path="/podcast" element={
          <ProtectedRoute allowedRoles={['Founder', 'Editor']}>
            <PodcastManager />
          </ProtectedRoute>
        } />
        <Route path="/bulletin" element={
          <ProtectedRoute allowedRoles={['Founder', 'Editor']}>
            <BulletinExport />
          </ProtectedRoute>
        } />

        {/* 404 Catch All */}
        <Route path="*" element={
          <div className="text-center mt-20">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-muted-foreground">Page not found</p>
          </div>
        } />
      </Route>
    </Routes>
  );
}
