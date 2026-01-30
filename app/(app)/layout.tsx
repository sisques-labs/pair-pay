import { Metadata } from 'next';
import { AppHeader } from '@/components/app-header';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'PairPay - Gestión de gastos en pareja',
  description: 'Gestiona tus gastos compartidos de forma sencilla',
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
