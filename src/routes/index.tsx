import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Trophy, Calendar, TrendingUp, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative min-h-[500px] overflow-hidden rounded-lg">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://pub-27bf0bf9c1e447639bcb4a0a3693697b.r2.dev/hero.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="relative z-10 flex min-h-[500px] flex-col items-center justify-center px-4 text-center text-white">
          <div className="mb-4 flex items-center gap-4">
            <img
              src="https://pub-27bf0bf9c1e447639bcb4a0a3693697b.r2.dev/Screenshot%202026-07-05%20at%2012.32.23%E2%80%AFAM.png"
              alt="Logo"
              className="h-20 w-20 rounded-full border-4 border-primary/50 shadow-lg sm:h-24 sm:w-24"
            />
            <h1
              className="text-5xl font-black uppercase tracking-wider sm:text-6xl md:text-7xl"
              style={{
                fontFamily: "'Bebas Neue', 'Oswald', 'Impact', sans-serif",
                textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
                letterSpacing: "0.05em",
              }}
            >
              Liga Deportiva
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                La Hermandad
              </span>
            </h1>
          </div>
          <p className="mb-8 max-w-2xl text-lg text-gray-200 sm:text-xl">
            Estadísticas en vivo, resultados históricos y todo lo que necesitas saber sobre nuestra
            liga
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="text-base">
              <Link to={ROUTES.TEAMS}>
                <Users className="mr-2 h-5 w-5" />
                Ver Equipos
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-base text-white backdrop-blur hover:bg-white/20"
            >
              <Link to={ROUTES.STANDINGS}>
                <Trophy className="mr-2 h-5 w-5" />
                Tabla de Posiciones
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-foreground text-3xl font-bold">Todo sobre la liga</h2>
            <p className="text-muted-foreground mt-2">Explora estadísticas, jugadores y más</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Users}
              title="Equipos"
              description="Conoce a todos los equipos que participan en la liga, sus colores y jugadores."
              to={ROUTES.TEAMS}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Jugadores"
              description="Perfiles detallados con estadísticas de bateo, pitcheo y fildeo de cada jugador."
              to={ROUTES.PLAYERS}
            />
            <FeatureCard
              icon={Calendar}
              title="Calendario"
              description="Próximos partidos, resultados recientes y horarios de la temporada."
              to={ROUTES.SCHEDULE}
            />
            <FeatureCard
              icon={Trophy}
              title="Posiciones"
              description="Tabla de posiciones actualizada con el standing completo de la temporada."
              to={ROUTES.STANDINGS}
            />
            <FeatureCard
              icon={Star}
              title="Líderes"
              description="Los mejores jugadores en cada categoría estadística de la liga."
              to={ROUTES.LEADERS}
            />
            <FeatureCard
              icon={Clock}
              title="Temporadas"
              description="Historial completo de todas las temporadas y campeones de la liga."
              to={ROUTES.ABOUT}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  to: string;
}

function FeatureCard({ icon: Icon, title, description, to }: FeatureCardProps) {
  return (
    <Link
      to={to}
      className="group bg-card hover:border-primary/50 relative overflow-hidden rounded-xl border p-6 transition-all hover:shadow-lg"
    >
      <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-foreground mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </Link>
  );
}
