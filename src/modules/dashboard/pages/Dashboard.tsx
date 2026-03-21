import { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import DashboardMobileHeader from '../components/DashboardMobileHeader';
import SectionRenderer from '../components/SectionRenderer';
import DashboardBottomNav from '../components/DashboardBottomNav';
import { useMyShop } from '../hooks/useShop';



export default function Dashboard() {
  const [active, setActive] = useState('home');
  const [accent, setAccent] = useState('#6344ee');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  //Hook que devuelve la tienda del usuario si tienda una tienda creada y activa, sino devuelve null
   const { data: myShop } = useMyShop();

  //hook para verificar si el usuario tiene una tienda creada y activa
  // const { data: checkUserStoreData } = useCheckUserStore();
  // const isActiveShop = checkUserStoreData?.data.hasActiveStore ?? false;

  const isActiveShop = !!myShop;
  // Cuando no tiene tienda activa, forzar a 'store' (Crear Tienda)
   const currentActive = !isActiveShop ? 'store' : active;
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
          active={currentActive}
          setActive={setActive}
          accent={accent}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          isActiveShop={isActiveShop}
        />

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* ── Desktop Header ── */}
          <DashboardHeader active={currentActive} accent={accent} />

          {/* ── Mobile Header ── */}
          <DashboardMobileHeader accent={accent} />

          {/* ── Scrollable Content ── */}
          <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6 pb-24 md:pb-8">
            <div className="max-w-5xl mx-auto w-full">
              <SectionRenderer
                active={currentActive}
                accent={accent}
                setAccent={setAccent}
                isActiveShop={isActiveShop}
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
        />
      </div>
    </>
  );
}
