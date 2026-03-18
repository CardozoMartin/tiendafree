import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils';
import FormChangePass from './FormChangePass';
import { useResetPassword } from '../hooks/useAuth';
import { useConfirm } from '../../../hooks/useConfirm';

vi.mock('../hooks/useAuth', () => ({
  useResetPassword: vi.fn(),
}));

vi.mock('../../../hooks/useConfirm', () => ({
  useConfirm: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams('token=test-token-123')],
  };
});

// ─── Mock helpers ─────────────────────────────────────────────────────────────
const mockResetHook = (overrides = {}) => {
  const mutate = vi.fn();
  (useResetPassword as ReturnType<typeof vi.fn>).mockReturnValue({
    mutate,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    ...overrides,
  });
  return { mutate };
};

const mockConfirmHook = (confirmado = true) => {
  const confirm = vi.fn().mockResolvedValue(confirmado);
  (useConfirm as ReturnType<typeof vi.fn>).mockReturnValue({
    confirm,
    ConfirmModal: null,
  });
  return { confirm };
};

// ─── Query helpers ────────────────────────────────────────────────────────────
// Los dos inputs tienen el mismo placeholder, usamos el atributo name para distinguirlos
const getPasswordNuevaInput = () =>
  document.querySelector('input[name="passwordNueva"]') as HTMLInputElement;
const getConfirmarPasswordInput = () =>
  document.querySelector('input[name="confirmarPassword"]') as HTMLInputElement;

// Cuando isPending=true el botón no tiene texto — buscamos por type="submit"
const getSubmitButton = () =>
  document.querySelector('button[type="submit"]') as HTMLButtonElement;

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('FormChangePass', () => {
  beforeEach(() => {
    mockResetHook();
    mockConfirmHook();
  });

  describe('Renderizado', () => {
    it('debe mostrar los dos campos de contraseña', () => {
      render(<FormChangePass />);
      expect(getPasswordNuevaInput()).toBeInTheDocument();
      expect(getConfirmarPasswordInput()).toBeInTheDocument();
    });

    it('debe mostrar los labels de los campos', () => {
      render(<FormChangePass />);
      expect(screen.getByText(/^nueva contraseña$/i)).toBeInTheDocument();
      expect(screen.getByText(/^confirmar nueva contraseña$/i)).toBeInTheDocument();
    });

    it('debe mostrar el botón de envío', () => {
      render(<FormChangePass />);
      expect(getSubmitButton()).toBeInTheDocument();
      expect(screen.getByText(/restablecer contraseña/i)).toBeInTheDocument();
    });
  });

  describe('Interacciones', () => {
    it('debe poder escribir en el campo nueva contraseña', async () => {
      render(<FormChangePass />);
      await userEvent.type(getPasswordNuevaInput(), 'password123');
      expect(getPasswordNuevaInput()).toHaveValue('password123');
    });

    it('debe poder escribir en el campo confirmar contraseña', async () => {
      render(<FormChangePass />);
      await userEvent.type(getConfirmarPasswordInput(), 'password123');
      expect(getConfirmarPasswordInput()).toHaveValue('password123');
    });

    it('debe toggle la visibilidad de la nueva contraseña', async () => {
      render(<FormChangePass />);
      const input = getPasswordNuevaInput();
      expect(input).toHaveAttribute('type', 'password');
      const toggleButtons = screen.getAllByRole('button').filter(
        (btn) => btn.getAttribute('type') === 'button'
      );
      await userEvent.click(toggleButtons[0]);
      expect(input).toHaveAttribute('type', 'text');
    });

    it('debe toggle la visibilidad de confirmar contraseña', async () => {
      render(<FormChangePass />);
      const input = getConfirmarPasswordInput();
      expect(input).toHaveAttribute('type', 'password');
      const toggleButtons = screen.getAllByRole('button').filter(
        (btn) => btn.getAttribute('type') === 'button'
      );
      await userEvent.click(toggleButtons[1]);
      expect(input).toHaveAttribute('type', 'text');
    });
  });

  describe('Validaciones', () => {
    it('debe mostrar alerta si las contraseñas no coinciden', async () => {
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      render(<FormChangePass />);
      await userEvent.type(getPasswordNuevaInput(), 'password123');
      await userEvent.type(getConfirmarPasswordInput(), 'diferente123');
      await userEvent.click(getSubmitButton());
      expect(alertMock).toHaveBeenCalledWith('Las contraseñas no coinciden');
      alertMock.mockRestore();
    });

    it('debe mostrar alerta si la contraseña tiene menos de 6 caracteres', async () => {
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      render(<FormChangePass />);
      await userEvent.type(getPasswordNuevaInput(), '123');
      await userEvent.type(getConfirmarPasswordInput(), '123');
      await userEvent.click(getSubmitButton());
      expect(alertMock).toHaveBeenCalledWith(
        'La contraseña debe tener al menos 6 caracteres'
      );
      alertMock.mockRestore();
    });
  });

  describe('Flujo de confirmación', () => {
    it('debe llamar a confirm antes de hacer el reset', async () => {
      const { confirm } = mockConfirmHook(true);
      render(<FormChangePass />);
      await userEvent.type(getPasswordNuevaInput(), 'password123');
      await userEvent.type(getConfirmarPasswordInput(), 'password123');
      await userEvent.click(getSubmitButton());
      await waitFor(() => {
        expect(confirm).toHaveBeenCalledWith(
          expect.objectContaining({ titulo: '¿Estas seguro?' })
        );
      });
    });

    it('debe llamar a mutate con los datos correctos si el usuario confirma', async () => {
      const { mutate } = mockResetHook();
      mockConfirmHook(true);
      render(<FormChangePass />);
      await userEvent.type(getPasswordNuevaInput(), 'password123');
      await userEvent.type(getConfirmarPasswordInput(), 'password123');
      await userEvent.click(getSubmitButton());
      await waitFor(() => {
        expect(mutate).toHaveBeenCalledWith({
          token: 'test-token-123',
          passwordNueva: 'password123',
          confirmarPassword: 'password123',
        });
      });
    });

    it('NO debe llamar a mutate si el usuario cancela', async () => {
      const { mutate } = mockResetHook();
      mockConfirmHook(false);
      render(<FormChangePass />);
      await userEvent.type(getPasswordNuevaInput(), 'password123');
      await userEvent.type(getConfirmarPasswordInput(), 'password123');
      await userEvent.click(getSubmitButton());
      await waitFor(() => {
        expect(mutate).not.toHaveBeenCalled();
      });
    });
  });

  describe('Estados', () => {
    it('debe deshabilitar el botón mientras isPending es true', () => {
      mockResetHook({ isPending: true });
      render(<FormChangePass />);
      expect(getSubmitButton()).toBeDisabled();
    });

    it('debe mostrar spinner y ocultar texto mientras isPending es true', () => {
      mockResetHook({ isPending: true });
      render(<FormChangePass />);
      expect(screen.queryByText(/restablecer contraseña/i)).not.toBeInTheDocument();
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('debe llamar a onSuccess cuando isSuccess es true', () => {
      const onSuccess = vi.fn();
      mockResetHook({ isSuccess: true });
      render(<FormChangePass onSuccess={onSuccess} />);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});