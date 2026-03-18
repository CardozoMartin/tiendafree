import { NAV_ITEMS } from "../constant/constants";
import MI from "./MaterialIcon";


interface DashboardBottomNavProps {
  active: string;
  setActive: (id: string) => void;
  accent: string;
  isActiveShop?: boolean;
}

export const DashboardBottomNav = ({
  active,
  setActive,
  accent,
  isActiveShop,
}: DashboardBottomNavProps) => {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 z-40 safe-area-pb">
      <div className="flex items-center">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const isDisabled = !isActiveShop && item.id !== 'store';
          const label = !isActiveShop && item.id === 'store' ? 'Crear Tienda' : item.label;

          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && setActive(item.id)}
              disabled={isDisabled}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-all relative ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              {isActive && !isDisabled && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                  style={{ backgroundColor: accent }}
                />
              )}
              <MI
                name={item.icon}
                className={`!text-[22px] transition-all ${
                  isDisabled ? 'text-slate-400' : isActive ? '' : 'text-slate-400'
                }`}
                style={isActive && !isDisabled ? { color: accent } : {}}
              />
              <span
                className={`text-[10px] font-bold transition-all ${
                  isDisabled ? 'text-slate-400' : isActive ? '' : 'text-slate-400'
                }`}
                style={isActive && !isDisabled ? { color: accent } : {}}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default DashboardBottomNav;
