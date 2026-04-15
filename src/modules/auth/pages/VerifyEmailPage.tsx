import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../../api/ApiBase';
import { ROUTES } from '../../../constants/routes';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando tu cuenta de administrador...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado.');
      return;
    }

    const verificar = async () => {
      try {
        await api.get(`/auth/verificar-email/${token}`);
        setStatus('success');
        setMessage('¡Tu cuenta de administrador ha sido verificada exitosamente! Ya podés ingresar al panel.');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.mensaje || 'Error al verificar la cuenta.');
      }
    };

    verificar();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
        <div className="mb-8 flex justify-center">
          {status === 'loading' && <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />}
          {status === 'success' && <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-2xl">✓</div>}
          {status === 'error' && <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl">✕</div>}
        </div>
        <h1 className="text-2xl font-bold mb-4">{status === 'loading' ? 'Verificando...' : status === 'success' ? 'Éxito' : 'Error'}</h1>
        <p className="text-slate-500 mb-8">{message}</p>
        {status !== 'loading' && (
          <button onClick={() => navigate(ROUTES.LOGIN)} className="w-full py-3 bg-[#6344ee] text-white rounded-xl font-bold">Ir al Login</button>
        )}
      </div>
    </div>
  );
}
