import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <SearchX className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Página no encontrada</CardTitle>
          <CardDescription>
            La página que buscas no existe o ha sido movida.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-7xl font-bold text-primary/20">404</p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href="javascript:history.back()">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <Button asChild variant="default" className="flex-1">
            <Link href="/">
              <Home className="h-4 w-4" />
              Inicio
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
