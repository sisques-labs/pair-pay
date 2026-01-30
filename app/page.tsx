import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt, Scale, Wallet, ArrowRight, Check } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Emoji */}
          <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
              <span className="text-7xl md:text-8xl">💑</span>
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl -z-10" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Gastos compartidos,{' '}
              <span className="text-primary">simplificados</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Para parejas que comparten gastos, no complicaciones.
              Balance automático 50/50 que siempre está al día.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <Button asChild size="lg" className="text-base px-8 h-12 shadow-lg shadow-primary/25">
              <Link href="/register">
                Comenzar gratis
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 h-12">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4 animate-in fade-in duration-700 delay-300">
            <Check className="h-4 w-4 text-primary" />
            <span>Gratis · Sin publicidad · Privado</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <Card className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Registra en segundos</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Añade gastos con un par de toques. Categorías inteligentes,
                  fechas automáticas, y notas opcionales.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 md:scale-105">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Scale className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Balance automático</h3>
                <p className="text-muted-foreground leading-relaxed">
                  División 50/50 instantánea. Siempre sabes quién debe a quién,
                  sin calculadora.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Salda y archiva</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Registra pagos con un clic. Historial completo de todas
                  las liquidaciones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Cómo funciona
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/25">
                1
              </div>
              <div className="pt-2 space-y-2">
                <h4 className="text-xl font-semibold">Crea tu pareja</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Regístrate en 30 segundos. Comparte el código de invitación con tu pareja
                  y empezad juntos. Sin complicaciones.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg shadow-lg shadow-accent/25">
                2
              </div>
              <div className="pt-2 space-y-2">
                <h4 className="text-xl font-semibold">Registra gastos</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Cada vez que uno pague, añádelo a PairPay. Restaurantes, supermercado,
                  alquiler... todo en un mismo sitio.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/25">
                3
              </div>
              <div className="pt-2 space-y-2">
                <h4 className="text-xl font-semibold">Mantén el equilibrio</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Revisa el balance cuando quieras. Cuando alguien pague su parte,
                  márcalo como saldado. Así de simple.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Empieza hoy mismo
          </h2>
          <p className="text-lg text-muted-foreground">
            Crea tu cuenta gratis y gestiona vuestros gastos compartidos en minutos.
          </p>
          <Button asChild size="lg" className="text-base px-8 h-12 shadow-lg shadow-primary/25">
            <Link href="/register">
              Crear cuenta gratis
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2026 PairPay · Gestión de gastos en pareja</p>
        </div>
      </footer>
    </div>
  );
}
