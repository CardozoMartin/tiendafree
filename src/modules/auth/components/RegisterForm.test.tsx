// src/modules/auth/components/RegisterForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils';
import RegisterForm from './RegisterForm';

vi.mock('../hooks/useAuth', () => ({
  useAuthRegister: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

import { useAuthRegister } from '../hooks/useAuth';

const mockRegisterHook = (overrides = {}) => {
  const mutate = vi.fn();
  (useAuthRegister as ReturnType<typeof vi.fn>).mockReturnValue({
    mutate,
    isPending: false,
    ...overrides,
  });
  return { mutate };
};

// ✅ Helpers — telefono usa getElementById porque type="tel" no es textbox
const getNombreInput = () => screen.getByRole('textbox', { name: /nombre/i });
const getApellidoInput = () => screen.getByRole('textbox', { name: /apellido/i });
const getEmailInput = () => screen.getByRole('textbox', { name: /email/i });
const getPasswordInput = () => document.getElementById('password') as HTMLElement;
const getTelefonoInput = () => document.getElementById('telefono') as HTMLElement;
const getSubmitButton = () => screen.getByRole('button', { name: /registrarse/i });

// ✅ Todo adentro de un solo describe principal
describe('RegisterForm', () => {
  beforeEach(() => {
    mockRegisterHook();
  });

  // ─── RENDERIZADO ──────────────────────────────────────

  describe('Renderizado', () => {
    it('debe mostrar el formulario completo', () => {
      render(<RegisterForm />);

      expect(getNombreInput()).toBeInTheDocument();
      expect(getApellidoInput()).toBeInTheDocument();
      expect(getEmailInput()).toBeInTheDocument();
      expect(getPasswordInput()).toBeInTheDocument();
      expect(getTelefonoInput()).toBeInTheDocument();
      expect(getSubmitButton()).toBeInTheDocument();
    });

    it('debe mostrar el logo y el título', () => {
      render(<RegisterForm />);

      expect(screen.getByText('Vitrina')).toBeInTheDocument();
      expect(screen.getByText(/crea tu cuenta/i)).toBeInTheDocument();
    });

    it('el campo password debe estar oculto por defecto', () => {
      render(<RegisterForm />);

      expect(getPasswordInput()).toHaveAttribute('type', 'password');
    });
  });

  // ─── INTERACCIONES ────────────────────────────────────

  describe('Interacciones', () => {
    it('debe poder escribir en todos los campos', async () => {
      render(<RegisterForm />);
      const user = userEvent.setup();

      await user.type(getNombreInput(), 'Juan');
      await user.type(getApellidoInput(), 'Perez');
      await user.type(getEmailInput(), 'juan@test.com');
      await user.type(getPasswordInput(), 'Password1');
      await user.type(getTelefonoInput(), '123456789');

      expect(getNombreInput()).toHaveValue('Juan');
      expect(getApellidoInput()).toHaveValue('Perez');
      expect(getEmailInput()).toHaveValue('juan@test.com');
      expect(getPasswordInput()).toHaveValue('Password1');
      expect(getTelefonoInput()).toHaveValue('123456789');
    });

    it('debe alternar la visibilidad de la contraseña', async () => {
      render(<RegisterForm />);
      const user = userEvent.setup();

      const input = getPasswordInput();
      expect(input).toHaveAttribute('type', 'password');

      await user.click(screen.getByRole('button', { name: /mostrar contraseña/i }));
      expect(input).toHaveAttribute('type', 'text');

      await user.click(screen.getByRole('button', { name: /ocultar contraseña/i }));
      expect(input).toHaveAttribute('type', 'password');
    });

    it('debe llamar a mutate con los datos correctos al enviar', async () => {
      const { mutate } = mockRegisterHook();
      render(<RegisterForm />);
      const user = userEvent.setup();

      await user.type(getNombreInput(), 'Juan');
      await user.type(getApellidoInput(), 'Perez');
      await user.type(getEmailInput(), 'juan@test.com');
      await user.type(getPasswordInput(), 'Password1');
      await user.type(getTelefonoInput(), '123456789');
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(mutate).toHaveBeenCalledWith(
          {
            nombre: 'Juan',
            apellido: 'Perez',
            email: 'juan@test.com',
            password: 'Password1',
            telefono: '123456789',
          },
          expect.any(Object)
        );
      });
    });
  });

  // ─── VALIDACIONES ─────────────────────────────────────

  describe('Validaciones', () => {
    it('debe mostrar errores si se envía el formulario vacío', async () => {
      render(<RegisterForm />);
      const user = userEvent.setup();

      await user.click(getSubmitButton());

      await waitFor(() => {
        // ✅ Textos exactos del componente
        expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
        expect(screen.getByText('El apellido es obligatorio.')).toBeInTheDocument();
        expect(screen.getByText('El email es obligatorio.')).toBeInTheDocument();
        expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument();
        expect(screen.getByText('El teléfono es obligatorio.')).toBeInTheDocument();
      });
    });

    it('debe mostrar error si el email es inválido', async () => {
      render(<RegisterForm />);
      const user = userEvent.setup();

      await user.type(getEmailInput(), 'no-es-email');
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText('Ingresá un email válido.')).toBeInTheDocument();
      });
    });

    it('debe mostrar error si la contraseña tiene menos de 6 caracteres', async () => {
      render(<RegisterForm />);
      const user = userEvent.setup();

      await user.type(getNombreInput(), 'Juan');
      await user.type(getApellidoInput(), 'Perez');
      await user.type(getEmailInput(), 'juan@test.com');
      await user.type(getPasswordInput(), '123');
      await user.type(getTelefonoInput(), '123456789');
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText('Mínimo 6 caracteres.')).toBeInTheDocument();
      });
    });
  });

  // ─── ESTADOS ──────────────────────────────────────────

  describe('Estados', () => {
    it('debe mostrar spinner y deshabilitar el botón mientras carga', () => {
      mockRegisterHook({ isPending: true });
      render(<RegisterForm />);

      const boton = screen.getByRole('button', { name: /registrando/i });
      expect(boton).toBeDisabled();
    });

    it('debe mostrar error general del servidor', async () => {
      const { mutate } = mockRegisterHook();
      render(<RegisterForm />);
      const user = userEvent.setup();

      mutate.mockImplementation((_data: any, callbacks: any) => {
        callbacks.onError({
          response: {
            data: { mensaje: 'Error al registrar usuario.' },
          },
        });
      });

      await user.type(getNombreInput(), 'Juan');
      await user.type(getApellidoInput(), 'Perez');
      await user.type(getEmailInput(), 'juan@test.com');
      await user.type(getPasswordInput(), 'Password1');
      await user.type(getTelefonoInput(), '123456789');
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText('Error al registrar usuario.')).toBeInTheDocument();
      });
    });

    it('debe mostrar errores específicos por campo si el servidor los devuelve', async () => {
      const { mutate } = mockRegisterHook();
      render(<RegisterForm />);
      const user = userEvent.setup();

      mutate.mockImplementation((_data: any, callbacks: any) => {
        callbacks.onError({
          response: {
            data: {
              errores: ['email: Ya existe una cuenta con ese email'],
            },
          },
        });
      });

      await user.type(getNombreInput(), 'Juan');
      await user.type(getApellidoInput(), 'Perez');
      await user.type(getEmailInput(), 'juan@test.com');
      await user.type(getPasswordInput(), 'Password1');
      await user.type(getTelefonoInput(), '123456789');
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText('Ya existe una cuenta con ese email')).toBeInTheDocument();
      });
    });
  });
});
