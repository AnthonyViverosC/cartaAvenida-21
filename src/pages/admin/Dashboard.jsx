// Dashboard con estadísticas del negocio (lee en vivo desde Supabase).
import { useEffect, useState } from 'react';
import { Package, Tags, AlertTriangle, Percent, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { formatearPrecio } from '../../data/menu.js';

function Tarjeta({ icono: Icono, etiqueta, valor, color }) {
  return (
    <div className="glass rounded-2xl p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icono className="h-6 w-6" />
      </div>
      <div>
        <p className="text-3xl font-display text-white leading-none">{valor}</p>
        <p className="text-sm text-white/55 mt-1">{etiqueta}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [ultimos, setUltimos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        // Conteos con head:true (no traen filas, solo el total).
        const [prod, cats, agotados, promos, recientes] = await Promise.all([
          supabase.from('productos').select('id', { count: 'exact', head: true }),
          supabase.from('categorias').select('id', { count: 'exact', head: true }),
          supabase
            .from('productos')
            .select('id', { count: 'exact', head: true })
            .eq('disponible', false),
          supabase
            .from('promociones')
            .select('id', { count: 'exact', head: true })
            .eq('activa', true),
          supabase
            .from('productos')
            .select('id, nombre, precio, creado_en')
            .order('creado_en', { ascending: false })
            .limit(5),
        ]);

        setStats({
          productos: prod.count ?? 0,
          categorias: cats.count ?? 0,
          agotados: agotados.count ?? 0,
          promociones: promos.count ?? 0,
        });
        setUltimos(recientes.data || []);
      } catch (e) {
        console.error('[Dashboard] Error cargando estadísticas:', e);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 rounded-full border-2 border-bronze-600/30 border-t-bronze-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl gradient-text">Dashboard</h1>
        <p className="text-white/50">Resumen general de tu negocio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Tarjeta icono={Package} etiqueta="Productos" valor={stats.productos} color="bg-bronze-500/20 text-bronze-300" />
        <Tarjeta icono={Tags} etiqueta="Categorías" valor={stats.categorias} color="bg-gold-500/20 text-gold-400" />
        <Tarjeta icono={AlertTriangle} etiqueta="Agotados" valor={stats.agotados} color="bg-red-500/20 text-red-300" />
        <Tarjeta icono={Percent} etiqueta="Promociones activas" valor={stats.promociones} color="bg-neon-pink/20 text-neon-pink" />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-bronze-400" />
          <h2 className="font-display text-xl text-white">Últimos productos agregados</h2>
        </div>
        {ultimos.length === 0 ? (
          <p className="text-white/50 text-sm">Aún no hay productos.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {ultimos.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <span className="text-white/90">{p.nombre}</span>
                <span className="gradient-text font-semibold">{formatearPrecio(Number(p.precio))}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
