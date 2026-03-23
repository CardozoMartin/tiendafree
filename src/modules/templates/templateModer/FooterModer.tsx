const FooterModer = ({
  brandName = 'MyShop',
  accent = '#c9a96e',
  bgColor = '#0d0d12',
}: {
  brandName?: string;
  accent?: string;
  bgColor?: string;
}) => {
  const border = 'rgba(245,240,232,0.07)';
  const textMuted = 'rgba(245,240,232,0.35)';
  const textMain = 'rgba(245,240,232,0.7)';

  const socials = [
    {
      label: 'Instagram',
      href: '#',
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: '#',
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      label: 'Twitter / X',
      href: '#',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: '#',
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
          <polygon
            points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      ),
    },
  ];

  return (
    <footer
      className="px-6 md:px-16 lg:px-24 xl:px-32"
      style={{ background: bgColor, borderTop: `0.5px solid ${border}` }}
    >
      {/* Main row */}
      <div
        className="flex flex-wrap gap-10 justify-between py-10"
        style={{ borderBottom: `0.5px solid ${border}` }}
      >
        {/* ── Brand ── */}
        <div className="flex flex-col gap-2.5 min-w-[160px]">
          <div className="flex items-baseline gap-1">
            <span
              className="text-xl font-bold tracking-tighter uppercase"
              style={{ color: 'rgba(245,240,232,0.9)' }}
            >
              {brandName}
            </span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
          </div>
          <p
            className="text-xs font-light leading-relaxed"
            style={{ color: textMuted, lineHeight: 1.8, maxWidth: '200px' }}
          >
            Comprometidos con ofrecerte la mejor experiencia de compra.
          </p>
        </div>

        {/* ── Contacto ── */}
        <div className="flex flex-col gap-3">
          <p
            className="text-xs font-medium uppercase"
            style={{ color: textMuted, letterSpacing: '0.22em' }}
          >
            Contacto
          </p>
          <div className="flex flex-col gap-2.5">
            {[
              {
                icon: (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
                text: 'contacto@tienda.com',
              },
              {
                icon: (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.29 6.29l.98-.88a2 2 0 0 1 2.1-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                ),
                text: '+54 381 000-0000',
              },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <span style={{ color: accent, opacity: 0.65 }}>{icon}</span>
                <span style={{ fontSize: '0.75rem', color: textMain }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Dirección ── */}
        <div className="flex flex-col gap-3">
          <p
            className="text-xs font-medium uppercase"
            style={{ color: textMuted, letterSpacing: '0.22em' }}
          >
            Dirección
          </p>
          <div className="flex items-start gap-2">
            <span style={{ color: accent, opacity: 0.65, marginTop: '2px' }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <p style={{ fontSize: '0.75rem', color: textMain, lineHeight: 1.75 }}>
              Tucumán, Argentina
              <br />
              CP 4000
            </p>
          </div>
        </div>

        {/* ── Redes ── */}
        <div className="flex flex-col gap-3">
          <p
            className="text-xs font-medium uppercase"
            style={{ color: textMuted, letterSpacing: '0.22em' }}
          >
            Seguinos
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                title={label}
                className="flex items-center justify-center transition-all duration-200"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  border: `0.5px solid rgba(245,240,232,0.1)`,
                  color: textMuted,
                  textDecoration: 'none',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.color = accent;
                  e.currentTarget.style.background = `${accent}0f`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245,240,232,0.1)';
                  e.currentTarget.style.color = textMuted;
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-4">
        <p
          style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.18)', letterSpacing: '0.06em' }}
        >
          © {new Date().getFullYear()}{' '}
          <span style={{ color: accent, opacity: 0.65 }}>{brandName}</span> — Todos los derechos
          reservados.
        </p>
        <div className="flex items-center gap-5">
          {['Privacidad', 'Términos'].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontSize: '0.65rem',
                color: 'rgba(245,240,232,0.18)',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = textMuted)}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,240,232,0.18)')}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default FooterModer;
