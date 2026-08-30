import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, Package, Box, Users, MessageSquare, 
  Settings, LogOut, FileText, Image as ImageIcon, Menu, X, Coins, CheckSquare
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { customOrders, orders } = useCatalog();
  const { session, loading, logout } = useAdminAuth();

  useEffect(() => {
    if (!loading && !session) navigate('/admin/login');
  }, [loading, navigate, session]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const nav = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: Box, badge: orders.filter(o => o.status === 'NEW').length },
    { label: 'Custom Orders', href: '/admin/custom-orders', icon: CheckSquare, badge: customOrders.filter(o => o.status === 'NEW').length },
    { label: 'Inventory', href: '/admin/inventory', icon: Box },
    { label: 'Pricing', href: '/admin/pricing', icon: Coins },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { label: 'Content', href: '/admin/content', icon: FileText },
    { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const Sidebar = () => (
    <>
      <div className="flex h-[76px] items-center px-7 border-b border-[#b99763]/25">
        <Link href="/" className="flex items-center gap-3" data-testid="link-dashboard-brand">
          <span className="grid h-8 w-8 place-items-center border border-[#b99763] text-[#b99763]">✦</span>
          <span className="font-display text-2xl tracking-[.12em] text-[#e7ca9c]">MiLAEDiA</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-7 mb-4 font-meta text-[9px] uppercase tracking-[.32em] text-[#b99763]">Gallery Admin</div>
        <nav className="space-y-1 px-4">
          {nav.map(item => {
            const active = location === item.href || location.startsWith(item.href + '/');
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 font-meta text-[10px] uppercase tracking-[.16em] transition-colors rounded-sm ${active ? 'bg-[#b99763]/10 text-[#e7ca9c]' : 'text-[#c9c7c3]/60 hover:bg-[#b99763]/5 hover:text-[#e7ca9c]'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={15} className={active ? 'text-[#b99763]' : ''} strokeWidth={1.5} />
                  {item.label}
                </div>
                {item.badge ? (
                  <span className="grid h-5 min-w-5 place-items-center bg-[#b99763] px-1 text-[9px] text-[#060506] rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-7 border-t border-[#b99763]/25">
        <button 
          type="button" 
          onClick={handleLogout} 
          className="flex w-full items-center gap-3 px-3 py-2 font-meta text-[10px] uppercase tracking-[.16em] text-[#c9c7c3]/60 transition-colors hover:text-[#e7ca9c]"
          data-testid="button-admin-logout"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Exit Portal
        </button>
      </div>
    </>
  );

  if (loading) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#060506] text-[#b99763]">
        <p className="font-meta text-[10px] uppercase tracking-[.22em]">Verifying gallery session</p>
      </main>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-[100dvh] bg-[#060506] text-[#e7ca9c]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-[#b99763]/25 bg-[#080706] md:flex">
        <Sidebar />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex w-[80%] max-w-sm flex-col border-r border-[#b99763]/25 bg-[#080706]">
            <button 
              className="absolute right-4 top-6 text-[#c9c7c3] hover:text-[#e7ca9c]"
              onClick={() => setMobileOpen(false)}
            >
              <X size={24} />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-[76px] items-center justify-between border-b border-[#b99763]/25 px-5 md:px-10 bg-[#080706]">
          <button className="md:hidden text-[#b99763]" onClick={() => setMobileOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-[#b99763]/20 flex items-center justify-center text-[#b99763] font-meta text-[10px]">AD</div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-5 md:p-10 pb-24">
          {children}
        </main>
      </div>
    </div>
  );
}
