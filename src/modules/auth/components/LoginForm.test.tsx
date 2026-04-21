import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils';
import LoginForm from './LoginForm';
import { useAuthLogin } from '../hooks/useAuth';

vi.mock('../hooks/useAuth', () => ({
  useAuthLogin: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

const mockHook = (overrides = {}) => {
  const mutate = vi.fn();
  (useAuthLogin as ReturnType<typeof vi.fn>).mockReturnValue({
    mutate,
    isPending: false,
    isError: false,
    error: null,
    ...overrides,
  });
  return { mutate };
};

const getEmailInput = () => screen.getByRole('textbox', { name: /email/i });
const getPasswordInput = () => screen.getByLabelText('Contraseña'); // ← fix
const getSubmitButton = () => screen.getByRole('button', { name: /ingresar|ingresando/i });

describe('LoginForm', () => {
  beforeEach(() => {
    mockHook();
  });

  describe('Renderizado', () => {
    it('debe mostrar el formulario completo', () => {
      render(<LoginForm />);
      expect(getEmailInput()).toBeInTheDocument();
      expect(getPasswordInput()).toBeInTheDocument();
      expect(getSubmitButton()).toBeInTheDocument();
    });

    it('debe mostrar el logo y el título', () => {
      render(<LoginForm />);
      expect(screen.getByText('TiendiZi')).toBeInTheDocument();
      expect(screen.getByText(/bienvenido de nuevo/i)).toBeInTheDocument();
    });

    it('debe mostrar el link de olvidé mi contraseña', () => {
      render(<LoginForm />);
      expect(screen.getByText(/olvidé mi contraseña/i)).toBeInTheDocument();
    });
  });

  describe('Interacciones', () => {
    it('debe poder escribir en el campo email', async () => {
      render(<LoginForm />);
      await userEvent.type(getEmailInput(), 'test@example.com');
      expect(getEmailInput()).toHaveValue('test@example.com');
    });

    it('debe poder escribir en el campo password', async () => {
      render(<LoginForm />);
      await userEvent.type(getPasswordInput(), 'password123');
      expect(getPasswordInput()).toHaveValue('password123');
    });

    it('debe llamar a mutate con los datos del formulario al enviar', async () => {
      const { mutate } = mockHook();
      render(<LoginForm />);
      await userEvent.type(getEmailInput(), 'test@example.com');
      await userEvent.type(getPasswordInput(), 'password123');
      await userEvent.click(getSubmitButton());
      expect(mutate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('debe toggle la visibilidad de la contraseña', async () => {
      render(<LoginForm />);
      const passwordInput = getPasswordInput();
      expect(passwordInput).toHaveAttribute('type', 'password');
      await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' })); // ← fix
      expect(passwordInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Validaciones', () => {
    it('debe mostrar error si el email es obligatorio', async () => {
      render(<LoginForm />);
      await userEvent.click(getSubmitButton());
      expect(screen.getByText(/el email es obligatorio/i)).toBeInTheDocument();
    });

    it('debe mostrar error si el email es inválido', async () => {
      render(<LoginForm />);
      await userEvent.type(getEmailInput(), 'invalido@a'); // ← fix
      await userEvent.click(getSubmitButton());
      expect(screen.getByText(/ingresá un email válido/i)).toBeInTheDocument();
    });

    it('debe mostrar error si la contraseña es obligatoria', async () => {
      render(<LoginForm />);
      await userEvent.type(getEmailInput(), 'test@example.com');
      await userEvent.click(getSubmitButton());
      expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
    });

    it('debe mostrar error si la contraseña tiene menos de 6 caracteres', async () => {
      render(<LoginForm />);
      await userEvent.type(getEmailInput(), 'test@example.com');
      await userEvent.type(getPasswordInput(), '123');
      await userEvent.click(getSubmitButton());
      expect(screen.getByText(/mínimo 6 caracteres/i)).toBeInTheDocument();
    });
  });

  describe('Estados', () => {
    it('debe mostrar "Ingresando..." mientras isPending es true', () => {
      mockHook({ isPending: true });
      render(<LoginForm />);
      expect(screen.getByText(/ingresando/i)).toBeInTheDocument();
    });

    it('debe deshabilitar el botón mientras isPending es true', () => {
      mockHook({ isPending: true });
      render(<LoginForm />);
      expect(getSubmitButton()).toBeDisabled();
    });

    it('debe mostrar error del servidor cuando isError es true', () => {
      mockHook({
        isError: true,
        error: { response: { data: { mensaje: 'Credenciales incorrectas' } } },
      });
      render(<LoginForm />);
      expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
    });

    it('debe mostrar mensaje fallback cuando isError es true sin mensaje del servidor', () => {
      mockHook({ isError: true, error: null });
      render(<LoginForm />);
      expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
    });
  });
});