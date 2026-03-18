import { useAuthSessionStore } from "../../auth/store/useAuthSession";
import MI from "./MaterialIcon";



interface DashboardMobileHeaderProps {
  accent: string;
}

export const DashboardMobileHeader = ({ accent }: DashboardMobileHeaderProps) => {
  const { user } = useAuthSessionStore();

  // Obtener iniciales del nombre
  const getInitials = () => {
    if (!user) return 'US';
    const first = user.nombre?.[0] || 'U';

    return `${first}`.toUpperCase();
  };

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shrink-0">
      <div className="flex items-center gap-2">
        <div
          className="size-8 rounded-xl flex items-center justify-center text-white"
          style={{ backgroundColor: accent }}
        >
          <MI name="storefront" className="!text-base" />
        </div>
        <span className="font-black text-slate-900">Vitrina</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
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

export default DashboardMobileHeader;
