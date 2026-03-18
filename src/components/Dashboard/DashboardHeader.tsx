

import { useAuthSessionStore } from '../../modules/auth/store/useAuthSession';
import { MI } from './MaterialIcon';
import { NAV_ITEMS } from './constants';

interface DashboardHeaderProps {
  active: string;
  accent: string;
}

export const DashboardHeader = ({ active, accent }: DashboardHeaderProps) => {
  const { user } = useAuthSessionStore();

  // Obtener iniciales del nombre
  const getInitials = () => {
    if (!user) return 'US';
    const first = user.nombre?.[0] || 'U';
    return `${first}`.toUpperCase();
  };

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shrink-0">
      <div>
        <h2 className="text-sm font-black text-slate-900">
          {NAV_ITEMS.find((n) => n.id === active)?.label}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
          <MI name="notifications" className="!text-xl" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
        </button>
        <div
          className="size-9 rounded-xl flex items-center justify-center text-white text-xs font-black"
          style={{ backgroundColor: accent }}
        >
          {getInitials()}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
