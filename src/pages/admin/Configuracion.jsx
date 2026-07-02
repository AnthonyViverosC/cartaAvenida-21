// Configuración del negocio: nombre, eslogan, logo, portada, colores,
// horarios, dirección, teléfonos, WhatsApp y redes sociales.
import { useEffect, useState } from 'react';
import { Save, Store, Palette, MapPin, Share2 } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useConfig } from '../../context/ConfigContext.jsx';
import { obtenerConfig, guardarConfig } from '../../services/configuracion.js';
import { CONFIG_DEFAULT } from '../../config/defaults.js';

function Seccion({ icono: Icono, titulo, children }) {
  return (
    <section className="glass rounded-2xl p-5 md:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Icono className="h-5 w-5 text-bronze-400" />
        <h2 className="font-display text-xl text-white">{titulo}</h2>
      </div>
      {children}
    </section>
  );
}

const input =
  'w-full rounded-lg bg-night-800 border border-white/10 focus:border-bronze-500 outline-none text-white px-3 py-2.5 transition';

export default function Configuracion() {
  const toast = useToast();
  const { recargar } = useConfig();
  const [form, setForm] = useState(CONFIG_DEFAULT);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerConfig();
        // Fusiona con defaults para que ningún campo quede indefinido.
        setForm({
          ...CONFIG_DEFAULT,
          ...data,
          colores: { ...CONFIG_DEFAULT.colores, ...(data.colores || {}) },
          redes: { ...CONFIG_DEFAULT.redes, ...(data.redes || {}) },
        });
      } catch (e) {
        toast.error('No se pudo cargar la configuración.');
      } finally {
        setCargando(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));
  const setColor = (k, v) => setForm((f) => ({ ...f, colores: { ...f.colores, [k]: v } }));
  const setRed = (k, v) => setForm((f) => ({ ...f, redes: { ...f.redes, [k]: v } }));

  async function onGuardar(e) {
    e.preventDefault();
    if (!form.nombre_negocio?.trim()) {
      toast.error('El nombre del negocio es obligatorio.');
      return;
    }
    setGuardando(true);
    try {
      await guardarConfig({
        nombre_negocio: form.nombre_negocio.trim(),
        eslogan: form.eslogan,
        logo_url: form.logo_url,
        portada_url: form.portada_url,
        colores: form.colores,
        horarios: form.horarios,
        direccion: form.direccion,
        barrio: form.barrio,
        maps_url: form.maps_url,
        telefonos: form.telefonos,
        whatsapp: form.whatsapp,
        redes: form.redes,
        info_contacto: form.info_contacto,
      });
      await recargar(); // refresca la web pública al instante
      toast.exito('Configuración guardada.');
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 rounded-full border-2 border-bronze-600/30 border-t-bronze-400 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={onGuardar} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl gradient-text">Configuración</h1>
          <p className="text-white/50">Datos e identidad del negocio.</p>
        </div>
        <button
          type="submit"
          disabled={guardando}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-bronze-500 to-gold-500 text-night-950 font-semibold hover:shadow-gold transition disabled:opacity-60"
        >
          {guardando ? (
            <span className="h-4 w-4 rounded-full border-2 border-night-950/40 border-t-night-950 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Guardar cambios
        </button>
      </div>

      {/* Identidad */}
      <Seccion icono={Store} titulo="Identidad">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/70">Nombre del negocio *</label>
            <input className={input} value={form.nombre_negocio} onChange={(e) => set('nombre_negocio', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-white/70">Eslogan</label>
            <input className={input} value={form.eslogan || ''} onChange={(e) => set('eslogan', e.target.value)} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-white/70 block mb-1.5">Logo</label>
            <ImageUploader value={form.logo_url} onChange={(url) => set('logo_url', url)} carpeta="marca" />
          </div>
          <div>
            <label className="text-sm text-white/70 block mb-1.5">Portada (fondo del inicio)</label>
            <ImageUploader value={form.portada_url} onChange={(url) => set('portada_url', url)} carpeta="marca" />
          </div>
        </div>
      </Seccion>

      {/* Colores */}
      <Seccion icono={Palette} titulo="Colores del sitio">
        <p className="text-xs text-white/40 -mt-1">Cambia el acento principal (títulos y botones dorados).</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            ['primario', 'Color primario'],
            ['secundario', 'Color secundario'],
          ].map(([k, etq]) => (
            <div key={k}>
              <label className="text-sm text-white/70">{etq}</label>
              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="color"
                  className="h-11 w-12 rounded-lg bg-night-800 border border-white/10 cursor-pointer"
                  value={form.colores[k] || '#e6b656'}
                  onChange={(e) => setColor(k, e.target.value)}
                />
                <input className={input} value={form.colores[k] || ''} onChange={(e) => setColor(k, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </Seccion>

      {/* Contacto */}
      <Seccion icono={MapPin} titulo="Contacto y ubicación">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/70">Dirección</label>
            <input className={input} value={form.direccion || ''} onChange={(e) => set('direccion', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-white/70">Barrio / referencia</label>
            <input className={input} value={form.barrio || ''} onChange={(e) => set('barrio', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-white/70">Teléfono(s)</label>
            <input className={input} value={form.telefonos || ''} onChange={(e) => set('telefonos', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-white/70">Horarios</label>
            <input className={input} value={form.horarios || ''} onChange={(e) => set('horarios', e.target.value)} placeholder="Jue–Sáb 6pm–2am" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-white/70">Enlace de Google Maps (opcional)</label>
            <input className={input} value={form.maps_url || ''} onChange={(e) => set('maps_url', e.target.value)} placeholder="https://maps.app.goo.gl/..." />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-white/70">Información / aviso legal</label>
            <textarea rows={2} className={input} value={form.info_contacto || ''} onChange={(e) => set('info_contacto', e.target.value)} />
          </div>
        </div>
      </Seccion>

      {/* Redes y WhatsApp */}
      <Seccion icono={Share2} titulo="WhatsApp y redes sociales">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/70">WhatsApp (con código de país)</label>
            <input className={input} value={form.whatsapp || ''} onChange={(e) => set('whatsapp', e.target.value)} placeholder="573137877263" />
          </div>
          <div>
            <label className="text-sm text-white/70">Instagram (URL)</label>
            <input className={input} value={form.redes.instagram || ''} onChange={(e) => setRed('instagram', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-white/70">Facebook (URL)</label>
            <input className={input} value={form.redes.facebook || ''} onChange={(e) => setRed('facebook', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-white/70">TikTok (URL)</label>
            <input className={input} value={form.redes.tiktok || ''} onChange={(e) => setRed('tiktok', e.target.value)} />
          </div>
        </div>
      </Seccion>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={guardando}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-bronze-500 to-gold-500 text-night-950 font-semibold hover:shadow-gold transition disabled:opacity-60"
        >
          {guardando ? (
            <span className="h-4 w-4 rounded-full border-2 border-night-950/40 border-t-night-950 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
