import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/providers/auth-provider";
import { loginSchema } from "@/lib/validations";
import { handleError, getUserFriendlyMessage } from "@/lib/errors";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const validated = loginSchema.parse({ email, password });
      await signIn(validated.email, validated.password);
      navigate({ to: "/admin" });
    } catch (err) {
      const appError = handleError(err);
      setError(getUserFriendlyMessage(appError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-card w-full max-w-md space-y-8 rounded-lg border p-8 shadow-lg">
        <div>
          <h1 className="text-foreground text-center text-3xl font-bold">Iniciar Sesión</h1>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Liga Deportiva La Hermandad - Panel de Administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-foreground block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-1 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-foreground block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-1 focus:outline-none"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 disabled:opacity-50"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
