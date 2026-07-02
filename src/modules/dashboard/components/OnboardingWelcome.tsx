import type { ReactNode } from 'react';
import welcomeImg from '../../../assets/onboarding/imagen de inicio.png';

interface OnboardingWelcomeProps {
  accent?: string;
  onStart: () => void;
  /** Imagen a mostrar. Por defecto, la de bienvenida ("imagen de inicio"). */
  image?: string;
  /** Título principal. Acepta JSX para resaltar palabras con el color de marca. */
  title?: ReactNode;
  /** Bajada principal (más grande). */
  description?: ReactNode;
  /** Bajada secundaria (más chica y clara). */
  subDescription?: ReactNode;
  /** Texto del botón CTA. */
  buttonLabel?: string;
  /** Ícono (Material Symbols) del botón. */
  buttonIcon?: string;
  /** Link de "Más información". Si es null, no se muestra. */
  helpHref?: string | null;
}

/**
 * Pantalla de bienvenida reutilizable del onboarding. Se usa como:
 *  - Paso previo al formulario de crear tienda ("¡Bienvenido a Tiendizi!").
 *  - Portada del editor de diseño ("Diseñá tu tienda").
 * Al tocar el CTA se ejecuta `onStart` (el padre revela el siguiente paso).
 */
const OnboardingWelcome = ({
  accent = '#6344ee',
  onStart,
  image = welcomeImg,
  title = (
    <>
      ¡Bienvenido a <span style={{ color: accent }}>Tiendizi</span>!
    </>
  ),
  description = 'Tu tienda online, fácil y sin complicaciones.',
  subDescription = 'Seguí estos pasos para empezar a vender.',
  buttonLabel = 'Comenzar ahora',
  buttonIcon = 'arrow_forward',
  helpHref = 'https://apptiendizi.netlify.app',
}: OnboardingWelcomeProps) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] py-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(99,68,238,0.35)] ring-1 ring-slate-100 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* ── Imagen ── */}
          <div
            className="flex items-center justify-center p-8 md:p-10"
            style={{
              background: `linear-gradient(160deg, ${accent}14 0%, ${accent}05 100%)`,
            }}
          >
            <img
              src={image}
              alt=""
              className="w-full max-w-xs md:max-w-sm object-contain drop-shadow-xl"
            />
          </div>

          {/* ── Texto + CTA ── */}
          <div className="flex flex-col justify-center p-8 md:p-12 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              {title}
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-500 font-medium">{description}</p>
            {subDescription && (
              <p className="mt-2 text-sm md:text-base text-slate-400 font-medium">
                {subDescription}
              </p>
            )}

            <button
              type="button"
              onClick={onStart}
              className="mt-8 inline-flex items-center justify-center gap-2 self-center md:self-start px-8 py-3.5 rounded-2xl text-white font-bold text-base shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: accent }}
            >
              {buttonLabel}
              <span className="material-symbols-outlined text-[20px]">{buttonIcon}</span>
            </button>

            {helpHref && (
              <a
                href={helpHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 self-center md:self-start text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">help</span>
                Más información
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWelcome;
