import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/features/auth/actions';
import { getCurrentCouple } from '@/features/couple/actions';
import { InvitationCodeDisplay } from '@/features/couple/components/invitation-code-display';

export default async function CouplePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const couple = await getCurrentCouple();

  // If user has a complete couple, go to the app.
  if (couple && couple.profiles.length >= 2) {
    redirect('/expenses');
  }

  // If user doesn't belong to a couple yet, offer both flows.
  if (!couple) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Pareja</CardTitle>
            <CardDescription>
              Para empezar, crea una pareja o únete con un código de invitación.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/couple/create" className="block">
              <Button className="w-full">Crear pareja</Button>
            </Link>
            <Link href="/couple/join" className="block">
              <Button variant="outline" className="w-full">
                Unirme con un código
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Couple exists but only one member so far.
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Invita a tu pareja</CardTitle>
          <CardDescription>
            Comparte este código para que tu pareja se una. Cuando se una, podrás acceder a los gastos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-2 space-y-3">
            <p className="text-sm text-muted-foreground">Tu código de invitación es:</p>
            <InvitationCodeDisplay code={couple.invitationCode} />
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Miembros actuales: <span className="text-foreground font-medium">{couple.profiles.length}</span> / 2
            </p>
            <p>Tu pareja debe registrarse y luego ir a “Unirse a una Pareja” para introducir este código.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Link href="/couple/join" className="w-full">
            <Button variant="outline" className="w-full">
              Tengo un código para unirme (otra cuenta)
            </Button>
          </Link>
          <Link href="/expenses" className="w-full">
            <Button className="w-full" disabled>
              Ir a gastos
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

