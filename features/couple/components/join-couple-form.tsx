'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { joinCouple } from '../actions';

export function JoinCoupleForm() {
  const router = useRouter();
  const [invitationCode, setInvitationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await joinCouple(invitationCode.trim().toUpperCase());
      if (!result.success && result.error) {
        setError(result.error);
      }
      // Si success, el server action redirige automáticamente
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Unirse a una Pareja</CardTitle>
        <CardDescription>
          Introduce el código de invitación que te compartió tu pareja
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="code">Código de Invitación</Label>
            <Input
              id="code"
              type="text"
              placeholder="XXXXXXXX"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
              maxLength={8}
              required
              disabled={isLoading}
              className="text-center text-lg font-mono tracking-wider"
            />
            <p className="text-xs text-muted-foreground">
              El código tiene 8 caracteres
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading || invitationCode.length !== 8}>
            {isLoading ? 'Uniéndose...' : 'Unirse a Pareja'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push('/couple/create')}
          >
            Crear mi propia pareja
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
