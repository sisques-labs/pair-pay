import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autenticación - PairPay',
  description: 'Inicia sesión o regístrate en PairPay',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col items-center py-8">
          <h1 className="text-4xl font-bold text-primary mb-2">💑 PairPay</h1>
          <p className="text-muted-foreground mb-8">Gestión de gastos en pareja</p>
          {children}
        </div>
      </div>
    </div>
  );
}
