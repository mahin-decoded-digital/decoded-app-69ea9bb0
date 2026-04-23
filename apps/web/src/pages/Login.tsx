import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/types';

export default function Login() {
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('Dennis Ryan');
  const [role, setRole] = useState<UserRole>('Founder');
  const [compensationModel, setCompensationModel] = useState<'salary' | 'retainer' | 'per-article'>('salary');
  
  const from = location.state?.from?.pathname || '/';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: Math.random().toString(36).substring(7),
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      role,
      compensationModel,
      baseRate: role === 'Contributor' ? 100 : 5000
    });
    navigate(from, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Stable Press</CardTitle>
          <CardDescription>Sign in to your publishing dashboard.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                <SelectItem value="Founder">Founder</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Contributor">Contributor</SelectItem>
                <SelectItem value="Subscriber">Subscriber</SelectItem>
              </Select>
            </div>
            {role === 'Contributor' && (
              <div className="space-y-2">
                <Label>Compensation Model</Label>
                <Select value={compensationModel} onValueChange={(val) => setCompensationModel(val as any)}>
                  <SelectItem value="per-article">Per Article</SelectItem>
                  <SelectItem value="retainer">Retainer</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                </Select>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Sign In</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
