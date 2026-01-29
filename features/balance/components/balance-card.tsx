import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils/format';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
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
    <Card>
      <CardHeader>
        <CardTitle>Balance Actual</CardTitle>
        <CardDescription>Estado de las cuentas entre ambos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Net Balance Display */}
        <div className="text-center py-6 space-y-2">
          {isBalanced ? (
            <>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                ✓ Balanceado
              </div>
              <p className="text-muted-foreground">
                Todas las cuentas están al día
              </p>
            </>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-2">
                {currentUserOwes ? (
                  <>
                    <TrendingDown className="inline h-4 w-4 mr-1" />
                    Debes
                  </>
                ) : (
                  <>
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    Te deben
                  </>
                )}
              </div>
              <div className={`text-5xl font-bold ${currentUserOwes ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                {formatCurrency(balance.netBalance)}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">
                  {currentUserOwes ? 'Tú' : otherUserBalance.fullName || otherUserBalance.email.split('@')[0]}
                </span>
                <ArrowRight className="h-4 w-4" />
                <span className="font-medium">
                  {currentUserOwes ? otherUserBalance.fullName || otherUserBalance.email.split('@')[0] : 'Tú'}
                </span>
              </div>
            </>
          )}
        </div>

        <Separator />

        {/* Individual Balances */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-1">
            <div className="text-sm text-muted-foreground">
              {currentUserBalance.fullName || 'Tú'}
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground">Pagado</div>
                <div className="font-semibold">{formatCurrency(currentUserBalance.totalPaid)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Debe pagar</div>
                <div className="font-semibold">{formatCurrency(currentUserBalance.totalOwed)}</div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-sm text-muted-foreground">
              {otherUserBalance.fullName || otherUserBalance.email.split('@')[0]}
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground">Pagado</div>
                <div className="font-semibold">{formatCurrency(otherUserBalance.totalPaid)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Debe pagar</div>
                <div className="font-semibold">{formatCurrency(otherUserBalance.totalOwed)}</div>
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
