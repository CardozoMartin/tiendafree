import { LogOut } from 'lucide-react';
import { useAuthSessionStore } from '../../modules/auth/store/useAuthSession';
import { MI } from './MaterialIcon';
import { NAV_ITEMS } from './constants';
import { useConfirm } from '../../hooks/useConfirm';

interface DashboardSidebarProps {
  active: string;
  setActive: (id: string) => void;
  accent: string;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isActiveShop?: boolean;
}

export const DashboardSidebar = ({
  active,
  setActive,
  accent,
  sidebarCollapsed,
  setSidebarCollapsed,
  isActiveShop,
}: DashboardSidebarProps) => {

  const {confirm,ConfirmModal} = useConfirm()
  const handleLogout = async () => {


    const confirmedLogout = await confirm({
      titulo: '¿Cerrar sesión?',
      descripcion: '¿Estás seguro de que deseas cerrar sesión?',
      textoCancelar: 'Cancelar',
      textoConfirmar: 'Cerrar sesión',
      variant: 'warning',
    });

    if (confirmedLogout) {
      useAuthSessionStore.getState().logout();
    }
  };
  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 bg-white border-r border-slate-100 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-[72px]' : 'w-[220px]'
      }`}
    >
        {ConfirmModal}
      {/* Logo */}
      <div
        className={`flex items-center gap-2.5 px-4 py-5 border-b border-slate-100 ${sidebarCollapsed ? 'justify-center' : ''}`}
      >
        <div
          className="size-9 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"
          style={{ backgroundColor: accent, boxShadow: `0 4px 12px ${accent}40` }}
        >
          <MI name="storefront" className="!text-[18px]" />
        </div>
        {!sidebarCollapsed && <span className="text-xl font-black text-slate-900">Vitrina</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const isDisabled = !isActiveShop && item.id !== 'store';
          const label = !isActiveShop && item.id === 'store' ? 'Crear Tienda' : item.label;

          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && setActive(item.id)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all ${
                isDisabled
                  ? 'opacity-50 cursor-not-allowed text-slate-400'
                  : isActive
                    ? 'text-white'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
              style={
                isActive && !isDisabled
                  ? { backgroundColor: accent, boxShadow: `0 4px 12px ${accent}30` }
                  : {}
              }
              title={sidebarCollapsed ? label : undefined}
            >
              <MI name={item.icon} className="!text-xl shrink-0" />
              {!sidebarCollapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-slate-100">
        <button
          className="w-full flex items-center gap-3 rounded-xl px-3 py-3 bg-red-500 text-white hover:bg-red-600 transition-all"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-bold">Cerrar sesión</span>
        </button>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
        >
          <MI
            name={sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
            className="!text-xl shrink-0"
          />
          {!sidebarCollapsed && <span className="text-sm font-bold">Colapsar</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
