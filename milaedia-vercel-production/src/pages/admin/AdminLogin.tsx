import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { LogIn } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { session, loading: sessionLoading, login } = useAdminAuth();

  useEffect(() => {
    if (!sessionLoading && session) navigate('/admin/dashboard');
  }, [navigate, session, sessionLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 8) {
      setError('Email and valid password required.');
      return;
    }
    
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.ok) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Gallery access could not be verified.');
    }
    setLoading(false);
  };

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[#060506] px-5 text-[#e7ca9c]">
      <div className="w-full max-w-md border border-[#b99763]/35 bg-[#0c0a07] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 bg-[#b99763] text-[#060506] font-meta text-[8px] uppercase tracking-widest font-bold">
          Development Auth
        </div>
        
        <Link href="/" className="flex items-center gap-3" data-testid="link-admin-brand">
          <span className="grid h-8 w-8 place-items-center border border-[#b99763] text-[#b99763]">✦</span>
          <span className="font-display text-2xl tracking-[.14em]">MiLAEDiA</span>
        </Link>
        
        <div className="mt-16">
          <div className="font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">Private portal</div>
          <h1 className="mt-4 font-display text-5xl text-[#e7ca9c]">
            Gallery<br /><i className="text-[#b99763]">access.</i>
          </h1>
          
          {error && (
            <div className="mt-6 border border-[#7b311d]/50 bg-[#7b311d]/10 px-4 py-3 font-meta text-[10px] text-[#e7ca9c]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-10 space-y-7" data-testid="form-admin-login">
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Email</span>
              <input 
                required 
                type="email" 
                autoComplete="username"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none focus:text-[#b99763] transition-colors" 
                data-testid="input-admin-email" 
              />
            </label>
            <label className="block border-b border-[#b99763]/35 pb-2">
              <span className="font-meta text-[9px] uppercase tracking-[.14em] text-[#c9c7c3]/45">Password</span>
              <input 
                required 
                type="password"
                autoComplete="current-password"
                minLength={8} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="mt-2 w-full bg-transparent text-sm text-[#e7ca9c] outline-none focus:text-[#b99763] transition-colors" 
                data-testid="input-admin-password" 
              />
            </label>
            <button 
              type="submit" 
              disabled={loading || sessionLoading}
              className="mt-10 flex w-full items-center justify-between bg-[#b99763] px-6 py-5 font-meta text-[10px] uppercase tracking-[.18em] text-[#060506] transition-colors hover:bg-[#e7ca9c] disabled:opacity-50" 
              data-testid="button-admin-login"
            >
              {loading || sessionLoading ? 'Authenticating...' : 'Enter portal'} <LogIn size={15} />
            </button>
          </form>
          <p className="mt-5 font-meta text-[9px] leading-5 text-[#c9c7c3]/35">
            Development state: Any syntactically valid email and 8+ char password will pass.
          </p>
        </div>
      </div>
    </main>
  );
}
