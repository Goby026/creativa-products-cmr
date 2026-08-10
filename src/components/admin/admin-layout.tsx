import { useEffect, useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/admin", label: "Resumen", end: true },
  { to: "/admin/productos", label: "Productos", end: false },
  { to: "/admin/ajustes", label: "Ajustes", end: false },
];

export function AdminLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(async ({ data }) => {
      const s = data.session;
      if (!active) return;
      setSession(s);
      if (s) {
        const { data: rows } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", s.user.id);
        if (active) setIsAdmin((rows?.length ?? 0) > 0);
      }
      setChecking(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) setIsAdmin(null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (checking) return <Spinner />;
  if (!session) return <Navigate to="/admin/login" replace />;

  if (isAdmin === false) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-4xl">🚫</p>
        <h1 className="font-heading text-xl font-bold">Acceso restringido</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tu usuario no tiene permisos de administración. Agrega tu UUID en la
          tabla <code>admin_users</code>.
        </p>
        <Button
          variant="outline"
          onClick={() => void supabase.auth.signOut()}
        >
          Cerrar sesión
        </Button>
      </main>
    );
  }

  if (isAdmin === null) return <Spinner label="Verificando permisos…" />;

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <span className="font-heading text-lg font-bold">
            Panel <span className="text-primary">admin</span>
          </span>
          <nav className="flex items-center gap-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="text-xs text-muted-foreground hover:underline"
            >
              Ver sitio ↗
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void supabase.auth.signOut()}
            >
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
