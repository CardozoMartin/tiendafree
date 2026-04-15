import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils';
import ForgotPasswordForm from './ForgotPasswordForm';
import { useRequestPasswordReset } from '../hooks/useAuth';

vi.mock('../hooks/useAuth', () => ({
  useRequestPasswordReset: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

const mockHook = (overrides = {}) => {
  const mutate = vi.fn();
  (useRequestPasswordReset as ReturnType<typeof vi.fn>).mockReturnValue({
    mutate,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    ...overrides,
  });
  return { mutate };
};

const getEmailInput = () => screen.getByRole('textbox', { name: /email/i });
const getSubmitButton = () =>
  screen.getByRole('button', { name: /enviar instrucciones|enviando solicitud/i });

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    mockHook();
  });

  describe('Renderizado', () => {
    it('debe mostrar el campo email y el botón de envío', () => {
      render(<ForgotPasswordForm />);
      expect(getEmailInput()).toBeInTheDocument();
      expect(getSubmitButton()).toBeInTheDocument();
    });
  });

  describe('Interacciones', () => {
    it('debe poder escribir en el campo email', async () => {
      render(<ForgotPasswordForm />);
      await userEvent.type(getEmailInput(), 'test@example.com');
      expect(getEmailInput()).toHaveValue('test@example.com');
    });

    it('debe llamar a mutate con el email al enviar', async () => {
      const { mutate } = mockHook();
      render(<ForgotPasswordForm />);
      await userEvent.type(getEmailInput(), 'test@example.com');
      await userEvent.click(getSubmitButton());
      expect(mutate).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('Validaciones', () => {
    it('debe mostrar error si el formulario se envía vacío', async () => {
      render(<ForgotPasswordForm />);
      await userEvent.click(getSubmitButton());
      expect(screen.getByText(/el email es obligatorio/i)).toBeInTheDocument();
    });

    it('debe mostrar error si el email es inválido', async () => {
      render(<ForgotPasswordForm />);
      await userEvent.type(getEmailInput(), 'invalido@a'); // ← pasa browser, falla RHF
      await userEvent.click(getSubmitButton());
      expect(screen.getByText(/ingresá un email válido/i)).toBeInTheDocument();
    });
  });

  describe('Estados', () => {
    it('debe mostrar mensaje de éxito cuando isSuccess es true', () => {
      mockHook({ isSuccess: true });
      render(<ForgotPasswordForm />);
      expect(screen.getByText(/solicitud enviada con éxito/i)).toBeInTheDocument();
    });

    it('debe mostrar mensaje de error genérico cuando isError es true sin mensaje del server', () => {
      mockHook({ isError: true, error: null });
      render(<ForgotPasswordForm />);
      expect(screen.getByText(/error al enviar la solicitud/i)).toBeInTheDocument();
    });

    it('debe mostrar el mensaje de error del servidor cuando existe', () => {
      mockHook({
        isError: true,
        error: { response: { data: { mensaje: 'El email no está registrado' } } },
      });
      render(<ForgotPasswordForm />);
      expect(screen.getByText('El email no está registrado')).toBeInTheDocument();
    });

    it('debe mostrar texto de carga mientras isPending es true', () => {
      mockHook({ isPending: true });
      render(<ForgotPasswordForm />);
      expect(screen.getByText(/enviando solicitud/i)).toBeInTheDocument();
    });

    it('debe deshabilitar el botón mientras isPending es true', () => {
      mockHook({ isPending: true });
      render(<ForgotPasswordForm />);
      expect(getSubmitButton()).toBeDisabled();
    });
  });
});