import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '../constant/constants';
import MI from './MaterialIcon';

interface DashboardBottomNavProps {
  active: string;
  setActive: (id: string) => void;
  accent: string;
  isActiveShop?: boolean;
  pendingOrders?: number;
}

// Ítems que van fijos en el tab bar (los más usados)
const PINNED_IDS = ['store', 'products', 'orders'];

export const DashboardBottomNav = ({
  active,
  setActive,
  accent,
  isActiveShop,
  pendingOrders = 0,
}: DashboardBottomNavProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [storeDrawerOpen, setStoreDrawerOpen] = useState(false);

  // Separar ítems: fijos vs "más"
  const pinnedItems = NAV_ITEMS.filter((i) => PINNED_IDS.includes(i.id));
  const moreItems = NAV_ITEMS.filter((i) => !PINNED_IDS.includes(i.id));

  // Ítem de tienda con submenú
  const storeItem = NAV_ITEMS.find((i) => i.id === 'store');
  const storeHasSubmenu = storeItem && 'submenu' in storeItem && storeItem.submenu;

  // Verificar si algún subítem de tienda está activo
  const storeSubIds = storeHasSubmenu ? storeItem.submenu.map((s: any) => s.id) : [];
  const isStoreGroupActive = active === 'store' || storeSubIds.includes(active);

  const handleNavClick = (item: any) => {
    const isDisabled = !isActiveShop && item.id !== 'store';
    if (isDisabled) return;

    const hasSubmenu = 'submenu' in item && item.submenu && isActiveShop;

    if (item.id === 'store' && hasSubmenu) {
      setStoreDrawerOpen(true);
      setDrawerOpen(false);
      return;
    }

    setActive(item.id);
    setDrawerOpen(false);
  };

  // Label del ítem de tienda
  const storeLabel = !isActiveShop ? 'Crear tienda' : 'Tienda';

  return (
    <>
      {/* ── Bottom Tab Bar ───────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-zinc-100 z-40 safe-area-pb">
        <div className="flex items-stretch h-16">
          {/* Ítems fijos */}
          {pinnedItems.map((item) => {
            const isDisabled = !isActiveShop && item.id !== 'store';
            const isActive = item.id === 'store' ? isStoreGroupActive : active === item.id;
            const label = item.id === 'store' ? storeLabel : item.label;
            const hasSubmenu = 'submenu' in item && item.submenu && isActiveShop;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                disabled={isDisabled}
                className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-1 transition-all relative isolate
                  ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
              >
                {/* Removed SVG background as requested */}

                <div className="relative mt-1">
                  <MI
                    name={item.icon}
                    className="!text-[24px] transition-colors"
                    style={isActive && !isDisabled ? { color: accent } : { color: '#475569' }}
                  />
                  {/* Badge pedidos pendientes */}
                  {item.id === 'orders' && pendingOrders > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-black px-0.5">
                      {pendingOrders > 9 ? '9+' : pendingOrders}
                    </span>
                  )}
                  {/* Chevron badge para submenu */}
                  {hasSubmenu && (
                    <span className="absolute -top-1 -right-2 text-[8px] text-zinc-300">▾</span>
                  )}
                </div>

                <span
                  className="text-[11px] font-semibold transition-colors"
                  style={isActive && !isDisabled ? { color: accent } : { color: '#475569' }}
                >
                  {label}
                </span>
              </button>
            );
          })}

          {/* Botón "Más" */}
          {moreItems.length > 0 && (
            <button
              onClick={() => {
                setDrawerOpen(true);
                setStoreDrawerOpen(false);
              }}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 py-1 active:scale-95 transition-all relative isolate"
            >
              {/* Removed SVG background as requested */}
              <div className="relative mt-1">
                <MI
                  name="more_horiz"
                  className="!text-[24px] transition-colors"
                  style={drawerOpen ? { color: accent } : { color: '#475569' }}
                />
              </div>
              <span
                className="text-[11px] font-semibold transition-colors"
                style={drawerOpen ? { color: accent } : { color: '#475569' }}
              >
                Más
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* ── Store Submenu Drawer ─────────────────────────────────────────── */}
      {storeDrawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/20 z-50"
            onClick={() => setStoreDrawerOpen(false)}
          />
          <div className="md:hidden fixed bottom-16 inset-x-0 z-50 px-3 pb-2">
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-50">
                <div className="flex items-center gap-2">
                  <MI name="storefront" className="!text-[16px] text-slate-400" />
                  <span className="text-[13px] font-semibold text-slate-800">Tienda</span>
                </div>
                <button
                  onClick={() => setStoreDrawerOpen(false)}
                  className="text-zinc-300 hover:text-zinc-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Ir a la tienda principal */}
              <button
                onClick={() => {
                  setActive('store');
                  setStoreDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors border-b border-zinc-50
                  ${active === 'store' ? '' : 'hover:bg-zinc-50'}`}
                style={active === 'store' ? { backgroundColor: `${accent}0d` } : {}}
              >
                <span
                  className="size-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accent}15` }}
                >
                  <MI name="store" className="!text-[16px]" style={{ color: accent }} />
                </span>
                <div className="flex-1 text-left">
                  <p className="text-[13px] font-semibold text-slate-800">Mi tienda</p>
                  <p className="text-[11px] text-slate-400">Ver resumen general</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-200" />
              </button>

              {/* Subítems */}
              {storeHasSubmenu &&
                storeItem.submenu.map((sub: any) => {
                  const isSubActive = active === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActive(sub.id);
                        setStoreDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors border-b border-zinc-50 last:border-0
                      ${isSubActive ? '' : 'hover:bg-zinc-50'}`}
                      style={isSubActive ? { backgroundColor: `${accent}0d` } : {}}
                    >
                      <span
                        className="size-8 rounded-lg flex items-center justify-center"
                        style={
                          isSubActive
                            ? { backgroundColor: `${accent}15` }
                            : { backgroundColor: '#f4f4f5' }
                        }
                      >
                        <MI
                          name={sub.icon}
                          className="!text-[16px]"
                          style={isSubActive ? { color: accent } : { color: '#71717a' }}
                        />
                      </span>
                      <div className="flex-1 text-left">
                        <p
                          className="text-[13px] font-semibold"
                          style={isSubActive ? { color: accent } : { color: '#475569' }}
                        >
                          {sub.label}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-200" />
                    </button>
                  );
                })}
            </div>
          </div>
        </>
      )}

      {/* ── "Más" Drawer ────────────────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/20 z-50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="md:hidden fixed bottom-16 inset-x-0 z-50 px-3 pb-2">
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-50">
                <span className="text-[13px] font-semibold text-slate-800">Más opciones</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-zinc-300 hover:text-zinc-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {moreItems.map((item) => {
                const isDisabled = !isActiveShop && item.id !== 'store';
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!isDisabled) {
                        setActive(item.id);
                        setDrawerOpen(false);
                      }
                    }}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-zinc-50 last:border-0 transition-colors
                      ${isDisabled ? 'opacity-40 cursor-not-allowed' : isActive ? '' : 'hover:bg-zinc-50'}`}
                    style={isActive ? { backgroundColor: `${accent}0d` } : {}}
                  >
                    <span
                      className="size-8 rounded-lg flex items-center justify-center"
                      style={
                        isActive
                          ? { backgroundColor: `${accent}15` }
                          : { backgroundColor: '#f4f4f5' }
                      }
                    >
                      <MI
                        name={item.icon}
                        className="!text-[16px]"
                        style={isActive ? { color: accent } : { color: '#71717a' }}
                      />
                    </span>
                    <span
                      className="flex-1 text-left text-[13px] font-semibold"
                      style={isActive ? { color: accent } : { color: '#475569' }}
                    >
                      {item.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-200" />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardBottomNav;
