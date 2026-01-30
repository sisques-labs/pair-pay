import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils/format';
import { ArrowRight, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import type { CoupleBalance } from '../types';
import { SettleBalanceButton } from './settle-balance-button';

interface BalanceCardProps {
  balance: CoupleBalance;
  currentUserId: string;
}

export function BalanceCard({ balance, currentUserId }: BalanceCardProps) {
  const currentUserBalance = balance.user1.userId === currentUserId ? balance.user1 : balance.user2;
  const otherUserBalance = balance.user1.userId === currentUserId ? balance.user2 : balance.user1;

  const currentUserOwes = balance.owedBy === currentUserId;
  const isBalanced = balance.netBalance === 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5 border-b">
        <CardTitle className="flex items-center gap-2">
          {isBalanced ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : currentUserOwes ? (
            <TrendingDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <TrendingUp className="h-5 w-5 text-primary" />
          )}
          Balance Actual
        </CardTitle>
        <CardDescription>Estado de las cuentas entre ambos</CardDescription>
      </CardHeader>
      <CardContent className="pt-8 space-y-8">
        {/* Net Balance Display */}
        <div className="text-center space-y-4">
          {isBalanced ? (
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">
                  ¡Todo en orden!
                </div>
                <p className="text-muted-foreground">
                  No hay deudas pendientes
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Amount */}
              <div className="space-y-2">
                <div className={`text-6xl md:text-7xl font-bold tabular-nums ${currentUserOwes ? 'text-muted-foreground dark:text-muted-foreground' : 'text-primary'}`}>
                  {formatCurrency(balance.netBalance)}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  {currentUserOwes ? (
                    <>
                      <TrendingDown className="h-4 w-4" />
                      <span>Debes pagar</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4" />
                      <span>Te deben</span>
                    </>
                  )}
                </div>
              </div>

              {/* Payment direction visual */}
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full ${currentUserOwes ? 'bg-muted' : 'bg-muted'} flex items-center justify-center`}>
                    <span className="text-xl">
                      {currentUserOwes ? '😬' : '😊'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    {currentUserOwes ? 'Tú' : otherUserBalance.fullName || otherUserBalance.email.split('@')[0]}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <ArrowRight className={`h-8 w-8 ${currentUserOwes ? 'text-muted-foreground' : 'text-primary'}`} />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full ${!currentUserOwes ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center`}>
                    <span className="text-xl">
                      {!currentUserOwes ? '😬' : '😊'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    {currentUserOwes ? otherUserBalance.fullName || otherUserBalance.email.split('@')[0] : 'Tú'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Individual Balances */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            Desglose Individual
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {/* Current User */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-foreground">
                {currentUserBalance.fullName || 'Tú'}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Has pagado</span>
                  <span className="font-mono font-semibold text-sm">
                    {formatCurrency(currentUserBalance.totalPaid)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Debes pagar</span>
                  <span className="font-mono font-semibold text-sm">
                    {formatCurrency(currentUserBalance.totalOwed)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold">Balance</span>
                  <span className={`font-mono font-bold ${currentUserBalance.balance >= 0 ? 'text-primary' : 'text-muted-foreground dark:text-muted-foreground'}`}>
                    {currentUserBalance.balance >= 0 ? '+' : ''}{formatCurrency(Math.abs(currentUserBalance.balance))}
                  </span>
                </div>
              </div>
            </div>

            {/* Other User */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-foreground">
                {otherUserBalance.fullName || otherUserBalance.email.split('@')[0]}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Ha pagado</span>
                  <span className="font-mono font-semibold text-sm">
                    {formatCurrency(otherUserBalance.totalPaid)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Debe pagar</span>
                  <span className="font-mono font-semibold text-sm">
                    {formatCurrency(otherUserBalance.totalOwed)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold">Balance</span>
                  <span className={`font-mono font-bold ${otherUserBalance.balance >= 0 ? 'text-primary' : 'text-muted-foreground dark:text-muted-foreground'}`}>
                    {otherUserBalance.balance >= 0 ? '+' : ''}{formatCurrency(Math.abs(otherUserBalance.balance))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isBalanced && (
          <>
            <Separator />
            <SettleBalanceButton />
          </>
        )}
      </CardContent>
    </Card>
  );
}
