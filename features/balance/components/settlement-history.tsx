import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { History, ArrowRight, TrendingUp, Calendar, Banknote } from 'lucide-react';
import type { SettlementWithUsers } from '../types';

interface SettlementHistoryProps {
  settlements: SettlementWithUsers[];
  currentUserId: string;
}

export function SettlementHistory({ settlements, currentUserId }: SettlementHistoryProps) {
  // Calculate statistics
  const totalSettled = settlements.reduce((sum, s) => sum + s.amount, 0);
  const userPaidCount = settlements.filter(s => s.fromUser === currentUserId).length;
  const userReceivedCount = settlements.filter(s => s.toUser === currentUserId).length;
  const lastSettlement = settlements[0]; // Already sorted by date desc

  if (settlements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Liquidaciones
          </CardTitle>
          <CardDescription>No hay liquidaciones registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <History className="h-8 w-8" />
            </div>
            <p className="text-sm font-medium mb-1">Sin liquidaciones aún</p>
            <p className="text-xs">Las liquidaciones aparecerán aquí cuando saldes el balance</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Banknote className="h-4 w-4" />
                <span>Total liquidado</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(totalSettled)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>Liquidaciones</span>
              </div>
              <div className="text-2xl font-bold">{settlements.length}</div>
              <div className="text-xs text-muted-foreground">
                {userPaidCount} pagadas · {userReceivedCount} recibidas
              </div>
            </div>
          </CardContent>
        </Card>

        {lastSettlement && (
          <Card className="col-span-2 md:col-span-1">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Última liquidación</span>
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(lastSettlement.amount)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(lastSettlement.settledAt, 'relative')}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial Completo
          </CardTitle>
          <CardDescription>
            Todas las liquidaciones ordenadas por fecha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {settlements.map((settlement, index) => {
              const fromName = settlement.fromUserProfile.fullName || settlement.fromUserProfile.email.split('@')[0];
              const toName = settlement.toUserProfile.fullName || settlement.toUserProfile.email.split('@')[0];
              const isCurrentUserFrom = settlement.fromUser === currentUserId;
              const isCurrentUserTo = settlement.toUser === currentUserId;

              return (
                <div
                  key={settlement.id}
                  className="flex items-start md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors gap-4"
                >
                  <div className="flex-1 space-y-2 min-w-0">
                    {/* Payment direction */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`flex items-center gap-2 text-sm ${isCurrentUserFrom ? 'font-semibold' : ''}`}>
                        {isCurrentUserFrom && (
                          <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                        )}
                        <span className="truncate">
                          {isCurrentUserFrom ? 'Tú' : fromName}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className={`flex items-center gap-2 text-sm ${isCurrentUserTo ? 'font-semibold' : ''}`}>
                        {isCurrentUserTo && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                        <span className="truncate">
                          {isCurrentUserTo ? 'Tú' : toName}
                        </span>
                      </div>
                    </div>

                    {/* Date and notes */}
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {formatDate(settlement.settledAt, 'long')}
                      </div>
                      {settlement.notes && (
                        <p className="text-xs text-muted-foreground italic bg-muted/50 px-2 py-1 rounded">
                          {settlement.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Amount and badge */}
                  <div className="text-right space-y-2 shrink-0">
                    <div className="font-bold text-lg tabular-nums">
                      {formatCurrency(settlement.amount)}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Liquidado
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {settlements.length > 5 && (
            <div className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
              Mostrando {settlements.length} liquidaciones
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
