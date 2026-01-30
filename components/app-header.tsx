'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { logout } from '@/features/auth/actions';
import { useState } from 'react';
import { Receipt, Scale, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Gastos', href: '/expenses', icon: Receipt },
  { name: 'Balance', href: '/balance', icon: Scale },
  { name: 'Pareja', href: '/couple', icon: Users },
];

export function AppHeader() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      setIsLoggingOut(false);
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="border-b bg-background sticky top-0 z-40 md:relative">
        <div className="px-4 py-3 md:px-8 md:py-4 lg:px-12">
          <div className="flex items-center">
            {/* Left: Logo + Navigation */}
            <div className="flex items-center gap-6 md:gap-8 flex-1">
              <Link href="/expenses" className="flex items-center gap-2 shrink-0">
                <span className="text-2xl">💑</span>
                <span className="text-lg md:text-xl font-bold">PairPay</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex gap-6">
                {navigation.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent/50",
                        isActive
                          ? "text-primary-foreground bg-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Logout Button (Desktop) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hidden md:flex"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? 'Saliendo...' : 'Cerrar sesión'}
            </Button>

            {/* Right: Logout Icon (Mobile) */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="md:hidden"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-50 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground active:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-16" aria-hidden="true" />
    </>
  );
}
