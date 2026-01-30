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
      <main className="px-4 py-8 md:px-8 lg:px-12">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
