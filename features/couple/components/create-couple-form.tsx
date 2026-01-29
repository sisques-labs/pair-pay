'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { createCouple } from '../actions';
import { Copy, Check } from 'lucide-react';

export function CreateCoupleForm() {
  const router = useRouter();
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await createCouple();
      if (result.success && result.couple) {
        setInvitationCode(result.couple.invitationCode);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (invitationCode) {
      navigator.clipboard.writeText(invitationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    router.push('/couple');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Crear Pareja</CardTitle>
        <CardDescription>
          {invitationCode
            ? 'Comparte este código con tu pareja'
            : 'Crea una nueva pareja para empezar a gestionar gastos juntos'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!invitationCode ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Al crear una pareja, obtendrás un código único que tu pareja podrá usar para unirse.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-6 space-y-4">
              <p className="text-sm text-muted-foreground">Tu código de invitación es:</p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="text-2xl font-mono px-4 py-2">
                  {invitationCode}
                </Badge>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  className="h-10 w-10"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Comparte este código con tu pareja para que se una a tu cuenta.
              </p>
            </div>
            <Alert>
              <AlertDescription>
                Tu pareja debe registrarse en PairPay y usar este código para unirse.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!invitationCode ? (
          <Button onClick={handleCreate} className="w-full" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear Pareja'}
          </Button>
        ) : (
          <Button onClick={handleContinue} className="w-full">
            Continuar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
