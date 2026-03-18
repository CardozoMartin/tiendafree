// src/modules/auth/components/LoginForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils';
import LoginForm from './LoginForm';

vi.mock('../hooks/useAuth', () => ({
  useAuthLogin: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

import { useAuthLogin } from '../hooks/useAuth';

const mockLoginHook = (overrides = {}) => {
  const mutate = vi.fn();
  (useAuthLogin as ReturnType<typeof vi.fn>).mockReturnValue({
    mutate,
    isPending: false,
    ...overrides,
  });
  return { mutate };
};

// ✅ Helpers para queries precisas que evitan ambigüedad
const getEmailInput = () => screen.getByRole('textbox', { name: /email/i });
const getPasswordInput = () => document.getElementById('password') as HTMLElement;
const getSubmitButton = () => screen.getByRole('button', { name: /ingresar/i });

describe('LoginForm', () => {
  beforeEach(() => {
    mockLoginHook();
  });

  // ─── RENDERIZADO ──────────────────────────────────────

  describe('Renderizado', () => {
    it('debe mostrar el formulario completo', () => {
      render(<LoginForm />);

      expect(getEmailInput()).toBeInTheDocument();
      expect(getPasswordInput()).toBeInTheDocument();
      expect(getSubmitButton()).toBeInTheDocument();
      expect(screen.getByText(/olvidé mi contraseña/i)).toBeInTheDocument();
      expect(screen.getByText(/registrate/i)).toBeInTheDocument();
    });

    it('debe mostrar el logo y el título', () => {
      render(<LoginForm />);

      expect(screen.getByText('Vitrina')).toBeInTheDocument();
      expect(screen.getByText(/bienvenido de nuevo/i)).toBeInTheDocument();
    });

    it('el campo password debe estar oculto por defecto', () => {
      render(<LoginForm />);

      expect(getPasswordInput()).toHaveAttribute('type', 'password');
    });
  });

  // ─── INTERACCIONES ────────────────────────────────────

  describe('Interacciones', () => {
    it('debe poder escribir en los campos', async () => {
      render(<LoginForm />);
      const user = userEvent.setup();

      await user.type(getEmailInput(), 'juan@test.com');
      await user.type(getPasswordInput(), 'Password1');

      expect(getEmailInput()).toHaveValue('juan@test.com');
      expect(getPasswordInput()).toHaveValue('Password1');
    });

    it('debe alternar la visibilidad de la contraseña', async () => {
      render(<LoginForm />);
      const user = userEvent.setup();

      const input = getPasswordInput();
      const toggleMostrar = screen.getByRole('button', { name: /mostrar contraseña/i });

      expect(input).toHaveAttribute('type', 'password');
      await user.click(toggleMostrar);
      expect(input).toHaveAttribute('type', 'text');

      const toggleOcultar = screen.getByRole('button', { name: /ocultar contraseña/i });
      await user.click(toggleOcultar);
      expect(input).toHaveAttribute('type', 'password');
    });

    it('debe llamar a loginMutate con los datos correctos al enviar', async () => {
      const { mutate } = mockLoginHook();
      render(<LoginForm />);
      const user = userEvent.setup();

      await user.type(getEmailInput(), 'juan@test.com');
      await user.type(getPasswordInput(), 'Password1');
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(mutate).toHaveBeenCalledWith(
          { email: 'juan@test.com', password: 'Password1' },
          expect.any(Object)
        );
      });
    });
  });

  // ─── VALIDACIONES ─────────────────────────────────────

  describe('Validaciones', () => {
    it('debe mostrar errores si se envía el formulario vacío', async () => {
      render(<LoginForm />);
      const user = userEvent.setup();

      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText('El email es obligatorio.')).toBeInTheDocument();
        expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument();
      });
    });

    it('debe mostrar error si el email es inválido', async () => {
      render(<LoginForm />);
      const user = userEvent.setup();

      await user.type(getEmailInput(), 'no-es-email');
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText('Ingresá un email válido.')).toBeInTheDocument();
      });
    });

    it('debe mostrar error si la contraseña tiene menos de 6 caracteres', async () => {
      render(<LoginForm />);
      const user = userEvent.setup();

      await user.type(getEmailInput(), 'juan@test.com');
      await user.type(getPasswordInput(), '123');
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText('Mínimo 6 caracteres.')).toBeInTheDocument();
      });
    });
  });

  // ─── ESTADOS ──────────────────────────────────────────

  describe('Estados', () => {
    it('debe mostrar spinner y deshabilitar el botón mientras carga', () => {
      mockLoginHook({ isPending: true });
      render(<LoginForm />);

      // ✅ Cuando isPending el botón muestra "Ingresando..." no "Ingresar"
      const boton = screen.getByRole('button', { name: /ingresando/i });
      expect(boton).toBeDisabled();
    });

    it('debe mostrar error del servidor si la API falla', async () => {
      const { mutate } = mockLoginHook();
      render(<LoginForm />);
      const user = userEvent.setup();

      mutate.mockImplementation((_data: any, callbacks: any) => {
        callbacks.onError({
          response: { data: { message: 'Credenciales incorrectas.' } },
        });
      });

      await user.type(getEmailInput(), 'juan@test.com');
      await user.type(getPasswordInput(), 'Password1');
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText('Credenciales incorrectas.')).toBeInTheDocument();
      });
    });
  });
});
