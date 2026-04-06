import { useEffect, useState } from 'react';
import DashboardBottomNav from '../components/DashboardBottomNav';
import DashboardHeader from '../components/DashboardHeader';
import DashboardMobileHeader from '../components/DashboardMobileHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import SectionRenderer from '../components/SectionRenderer';
import { useOrders } from '../hooks/useOrders';
import { useMyShop } from '../hooks/useShop';

export default function Dashboard() {
  const [active, setActive] = useState(() => {
    return localStorage.getItem('dashboard_active_section') || 'store';
  });
  const [accent, setAccent] = useState('#6344ee');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Persistir la sección activa
  useEffect(() => {
    localStorage.setItem('dashboard_active_section', active);
  }, [active]);

  // Hook que devuelve la tienda del usuario si tiene una tienda creada y activa.
  const { data: myShop, isLoading: isMyShopLoading } = useMyShop();
  const isActiveShop = Boolean(myShop);

  // Pedidos pendientes (para badge en el menú)
  const { data: pendientesRes } = useOrders({
    tiendaId: myShop?.id,
    estado: 'PENDIENTE',
    limite: 50,
    pagina: 1,
  });
  const pendingOrders: number = pendientesRes?.datos?.length ?? 0;

  // No forzar aún la pantalla de creación si la tienda está en carga.
  const currentActive = !isMyShopLoading && !isActiveShop ? 'store' : active;
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet"
      />
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { height: 100%; overflow: hidden; }
        body { margin: 0; background: #f6f6f8; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .nav-item-active { background: var(--accent-bg); color: var(--accent); }
      `}</style>

      <div
        className="flex h-screen bg-[#f6f6f8] overflow-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* ── SIDEBAR (desktop) ── */}
        <DashboardSidebar
          myShop={myShop}
          active={currentActive}
          setActive={setActive}
          accent={accent}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          isActiveShop={isActiveShop}
          pendingOrders={pendingOrders}
        />

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
          {/* ── Desktop Header ── */}
          <DashboardHeader active={currentActive} accent={accent} />

          {/* ── Mobile Header ── */}
          <DashboardMobileHeader accent={accent} />

          {/* ── Scrollable Content ── */}
          <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 md:px-8 md:py-6 pb-24 md:pb-8">
            <div className="max-w-5xl mx-auto w-full min-h-0">
              <SectionRenderer
                active={currentActive}
                accent={accent}
                setAccent={setAccent}
                isActiveShop={isActiveShop}
                myShop={myShop}
              />
            </div>
          </main>
        </div>

        {/* ── BOTTOM NAV (mobile) ── */}
        <DashboardBottomNav
          active={currentActive}
          setActive={setActive}
          accent={accent}
          isActiveShop={isActiveShop}
          pendingOrders={pendingOrders}
        />
      </div>
    </>
  );
}
