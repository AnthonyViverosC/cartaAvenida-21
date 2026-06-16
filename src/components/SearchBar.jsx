import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, autoFocus = false }) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Buscar bebida..."
        className="w-full pl-11 pr-10 py-2.5 rounded-full bg-white/[0.04] border border-white/10
                   text-sm text-white placeholder-white/40 outline-none
                   focus:border-bronze-500/70 focus:bg-white/[0.07]
                   transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/50 hover:text-bronze-400 transition"
          aria-label="Limpiar búsqueda"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
