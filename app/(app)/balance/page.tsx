import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { getCurrentUser } from '@/features/auth/actions';
import { getCurrentCouple } from '@/features/couple/actions';
import { getCoupleBalance, getSettlements } from '@/features/balance/queries';
import { BalanceCard } from '@/features/balance/components/balance-card';
import { SettlementHistory } from '@/features/balance/components/settlement-history';

export default async function BalancePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const couple = await getCurrentCouple();
  if (!couple || couple.profiles.length < 2) {
    redirect('/couple');
  }

  const balance = await getCoupleBalance();
  const settlements = await getSettlements();

  if (!balance) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar balance</AlertTitle>
          <AlertDescription>
            No pudimos calcular el balance. Esto puede deberse a un problema temporal con la conexión.
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
          <Button asChild variant="ghost">
            <Link href="/expenses">Volver a gastos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/expenses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a gastos
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Balance</h1>
          <p className="text-muted-foreground">Resumen de cuentas y liquidaciones</p>
        </div>

        <BalanceCard balance={balance} currentUserId={user.id} />
        <SettlementHistory settlements={settlements} currentUserId={user.id} />
      </div>
    </div>
  );
}
