'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Loader2, PartyPopper } from 'lucide-react';
import { toast } from 'sonner';
import { createSettlement } from '../actions';

export function SettleBalanceButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSettle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createSettlement(notes || undefined);
      if (result.success) {
        // Show success toast
        toast.success('¡Balance liquidado!', {
          description: 'La liquidación se ha registrado correctamente.',
          icon: <PartyPopper className="h-5 w-5" />,
          duration: 4000,
        });

        // Reset form
        setNotes('');
        setOpen(false);

        // Refresh the page
        router.refresh();
      } else if (result.error) {
        setError(result.error);
        toast.error('Error al liquidar', {
          description: result.error,
        });
      }
    } catch (err) {
      const errorMsg = 'Ocurrió un error inesperado';
      setError(errorMsg);
      toast.error('Error', {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          <CheckCircle className="h-5 w-5" />
          Liquidar Balance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5 text-primary" />
            Liquidar Balance
          </DialogTitle>
          <DialogDescription>
            Marca que el balance ha sido pagado. Esta acción se registrará en el historial
            y se actualizará el balance automáticamente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="notes">
              Notas <span className="text-muted-foreground text-xs">(opcional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Ej: Pagado en efectivo, transferencia bancaria, Bizum..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              disabled={isLoading}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Añade detalles sobre cómo se realizó el pago
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            type="button"
          >
            Cancelar
          </Button>
          <Button onClick={handleSettle} disabled={isLoading} type="button">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Liquidando...' : 'Confirmar Liquidación'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
