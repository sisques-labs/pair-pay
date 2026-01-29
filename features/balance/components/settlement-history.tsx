import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { History, ArrowRight } from 'lucide-react';
import type { SettlementWithUsers } from '../types';

interface SettlementHistoryProps {
  settlements: SettlementWithUsers[];
  currentUserId: string;
}

export function SettlementHistory({ settlements, currentUserId }: SettlementHistoryProps) {
  if (settlements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Liquidaciones</CardTitle>
          <CardDescription>No hay liquidaciones registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <History className="h-12 w-12 mb-2" />
            <p className="text-sm">Las liquidaciones aparecerán aquí</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Liquidaciones</CardTitle>
        <CardDescription>
          {settlements.length} {settlements.length === 1 ? 'liquidación' : 'liquidaciones'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {settlements.map((settlement) => {
            const fromName = settlement.fromUserProfile.fullName || settlement.fromUserProfile.email.split('@')[0];
            const toName = settlement.toUserProfile.fullName || settlement.toUserProfile.email.split('@')[0];
            const isCurrentUserFrom = settlement.fromUser === currentUserId;

            return (
              <div
                key={settlement.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={isCurrentUserFrom ? 'font-semibold' : ''}>
                      {isCurrentUserFrom ? 'Tú' : fromName}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className={!isCurrentUserFrom ? 'font-semibold' : ''}>
                      {isCurrentUserFrom ? toName : 'Tú'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(settlement.settledAt, 'long')}
                  </div>
                  {settlement.notes && (
                    <p className="text-xs text-muted-foreground italic">{settlement.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(settlement.amount)}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Liquidado
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
