import { LogOut, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useConfirm } from '@components/ConfirmDialog/useConfirm';
import { useAuthSessionStore } from '../../auth/store/useAuthSession';
import { NAV_ITEMS } from '../constant/constants';
import MI from './MaterialIcon';

interface DashboardSidebarProps {
  active: string;
  setActive: (id: string) => void;
  accent: string;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isActiveShop?: boolean;
  myShop?: any;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

// ── Avatar ────────────────────────────────────────────────────────────────────

const UserAvatar = ({
  name,
  avatarUrl,
  size = 32,
  accent,
}: {
  name: string;
  avatarUrl?: string;
  size?: number;
  accent: string;
}) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover ring-2 ring-white shrink-0"
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        backgroundColor: `${accent}18`,
        color: accent,
      }}
      className="rounded-full flex items-center justify-center font-semibold shrink-0 ring-2 ring-white"
    >
      {getInitials(name)}
    </div>
  );
};

// ── Tooltip ───────────────────────────────────────────────────────────────────

const Tooltip = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="relative group/tooltip">
    {children}
    <div
      className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
      opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150"
    >
      <div className="bg-zinc-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-zinc-900" />
      </div>
    </div>
  </div>
);

// ── Sidebar ───────────────────────────────────────────────────────────────────

export const DashboardSidebar = ({
  active,
  setActive,
  accent,
  sidebarCollapsed,
  setSidebarCollapsed,
  isActiveShop,
  user = { name: 'Usuario', email: 'usuario@vitrina.app' },
}: DashboardSidebarProps) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>('store');
  const [logoutHovered, setLogoutHovered] = useState(false);
  const { confirm, ConfirmModal } = useConfirm();

  const handleLogout = async () => {
    const confirmed = await confirm({
      titulo: '¿Cerrar sesión?',
      descripcion: '¿Estás seguro de que deseas cerrar sesión?',
      textoCancelar: 'Cancelar',
      textoConfirmar: 'Cerrar sesión',
      variant: 'warning',
    });
    if (confirmed) useAuthSessionStore.getState().logout();
  };

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 bg-white border-r border-zinc-100 transition-all duration-200 ease-in-out relative ${
        sidebarCollapsed ? 'w-[60px]' : 'w-[228px]'
      }`}
    >
      {ConfirmModal}

      {/* ── Logo ── */}
      <div
        className={`flex items-center h-14 border-b border-zinc-100 px-3.5 shrink-0 ${
          sidebarCollapsed ? 'justify-center' : 'gap-2.5'
        }`}
      >
        <div
          className="size-7 rounded-lg flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: accent }}
        >
          <MI name="storefront" className="!text-[15px]" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-[15px] font-semibold text-zinc-900 tracking-tight">Vitrina</span>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            const isDisabled = !isActiveShop && item.id !== 'store';
            const label = !isActiveShop && item.id === 'store' ? 'Crear Tienda' : item.label;
            const isExpanded = expandedMenu === item.id;
            const hasSubmenu = 'submenu' in item && item.submenu;

            const navBtn = (
              <button
                key={item.id}
                onClick={() => {
                  if (isDisabled) return;
                  if (hasSubmenu && isActiveShop) {
                    setExpandedMenu(isExpanded ? null : item.id);
                  } else {
                    setActive(item.id);
                  }
                }}
                disabled={isDisabled}
                className={`
                  w-full flex items-center rounded-md text-sm transition-all duration-150 select-none
                  ${sidebarCollapsed ? 'justify-center px-0 py-2' : 'gap-2.5 px-2.5 py-2'}
                  ${
                    isDisabled
                      ? 'opacity-40 cursor-not-allowed text-zinc-400 font-medium'
                      : isActive || isExpanded
                        ? 'text-zinc-900 font-bold'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-medium'
                  }
                `}
                style={
                  (isActive || isExpanded) && !isDisabled ? { backgroundColor: `${accent}12`, color: accent } : {}
                }
              >
                {/* Icon */}
                <span
                  className={`shrink-0 flex items-center justify-center size-[18px] ${
                    isActive || isExpanded ? '' : 'opacity-70'
                  }`}
                  style={isActive || isExpanded ? { color: accent } : {}}
                >
                  <MI name={item.icon} className="!text-[17px]" />
                </span>

                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left text-[14px]">{label}</span>
                    {hasSubmenu && isActiveShop && (
                      <span className="text-zinc-300">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </>
                )}
              </button>
            );

            return (
              <div key={item.id}>
                {sidebarCollapsed && !isDisabled ? (
                  <Tooltip label={label}>{navBtn}</Tooltip>
                ) : (
                  navBtn
                )}

                {/* Submenu */}
                {hasSubmenu && isActiveShop && isExpanded && !sidebarCollapsed && (
                  <div className="mt-0.5 ml-4 pl-3.5 border-l border-zinc-200/60 space-y-0.5 py-1">
                    {item.submenu.map((sub) => {
                      const isSubActive = active === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setActive(sub.id)}
                          className={`
                            w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12.5px] transition-all duration-150
                            ${
                              isSubActive
                                ? 'font-semibold'
                                : 'text-zinc-500 font-medium hover:text-zinc-800 hover:bg-zinc-50'
                            }
                          `}
                          style={
                            isSubActive ? { color: accent, backgroundColor: `${accent}10` } : {}
                          }
                        >
                          <MI name={sub.icon} className="!text-[14px] shrink-0" />
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* ── Bottom ── */}
      <div className="shrink-0 border-t border-zinc-100">
        {/* User block */}
        <div
          className={`flex items-center gap-2.5 px-3 py-3 ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
        >
          <UserAvatar name={user.name} avatarUrl={user.avatarUrl} accent={accent} size={30} />
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-medium text-zinc-900 truncate leading-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-zinc-400 truncate leading-tight">{user.email}</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={handleLogout}
              onMouseEnter={() => setLogoutHovered(true)}
              onMouseLeave={() => setLogoutHovered(false)}
              className={`p-1.5 rounded-md transition-all duration-150 shrink-0 ${
                logoutHovered ? 'bg-red-50 text-red-500 shadow-sm' : 'text-zinc-300'
              }`}
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <div className="px-2 pb-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`
              w-full flex items-center rounded-md px-2 py-1.5 text-[12px] text-zinc-400
              hover:bg-zinc-50 hover:text-zinc-600 transition-all duration-150
              ${sidebarCollapsed ? 'justify-center' : 'gap-2'}
            `}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <>
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Colapsar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
