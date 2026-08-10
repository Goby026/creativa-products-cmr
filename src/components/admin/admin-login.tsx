import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/admin/admin-ui";

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
      else setChecking(false);
    });
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (authError) {
      setError(
        authError.message.toLowerCase().includes("invalid")
          ? "Correo o contraseña incorrectos"
          : authError.message,
      );
      return;
    }
    navigate("/admin", { replace: true });
  }

  if (checking) return <Spinner />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-6">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="font-heading text-2xl font-bold">
          Panel de <span className="text-primary">administración</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inicia sesión para gestionar el contenido del sitio.
        </p>

        {!isSupabaseConfigured ? (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p className="font-semibold text-destructive">
              Supabase no está configurado.
            </p>
            <p className="mt-1 text-muted-foreground">
              Crea un archivo <code>.env</code> con{" "}
              <code>VITE_SUPABASE_URL</code> y{" "}
              <code>VITE_SUPABASE_ANON_KEY</code> (ver{" "}
              <code>.env.example</code>) y reinicia el servidor.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tuempresa.pe"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ingresando…" : "Ingresar"}
            </Button>
          </form>
        )}

        <a
          href="/"
          className="mt-5 block text-center text-xs text-muted-foreground hover:underline"
        >
          ← Volver al sitio
        </a>
      </div>
    </main>
  );
}
