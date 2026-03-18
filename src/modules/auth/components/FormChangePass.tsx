import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useConfirm } from "../../../hooks/useConfirm";
import { useResetPassword } from "../hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react";

type RestablecerPasswordFormData = {
  passwordNueva: string;
  confirmarPassword: string;
};
interface ChangePasswordProps {
  token?: string;
  onSubmit?: (
    data: RestablecerPasswordFormData,
    token: string,
  ) => Promise<void>;
  onBack?: () => void;
  onSuccess?: () => void;
}

const FormChangePass = ({ token, onBack, onSuccess }: ChangePasswordProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenUrl = searchParams.get("token") || token;
  const handleBack = onBack ?? (() => navigate("/login"));
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  //manejo del formulario con RHF
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestablecerPasswordFormData>({
    defaultValues: { passwordNueva: "", confirmarPassword: "" },
  });
  //para mostrar el mensaje antes de enviar la peticion
  const { confirm, ConfirmModal } = useConfirm();

  //Tquery para el manejo de la peticion
  const {
    mutate: resetPasswordMutate,
    isPending,
    isSuccess,
  } = useResetPassword();

  // Llamar al callback onSuccess cuando el reset sea exitoso
  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  const onFormSubmit = async (data: RestablecerPasswordFormData) => {
    // Validar que el token existe
    if (!tokenUrl) {
      console.error("❌ Token no encontrado en la URL");
      alert(
        "Token inválido o expirado. Por favor solicita un nuevo reset de contraseña.",
      );
      return;
    }

    // Validar que las contraseñas coincidan
    if (data.passwordNueva !== data.confirmarPassword) {
      console.error("❌ Las contraseñas no coinciden");
      alert("Las contraseñas no coinciden");
      return;
    }

    // Validar longitud mínima
    if (data.passwordNueva.length < 6) {
      console.error("❌ La contraseña debe tener al menos 6 caracteres");
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const userConfirmed = await confirm({
      titulo: "¿Estas seguro?",
      descripcion: "¿Estás seguro de que deseas cambiar tu contraseña?",
      textoCancelar: "Cancelar",
      textoConfirmar: "Cambiar contraseña",
      variant: "info",
    });

    if (userConfirmed) {
      console.log("📤 Enviando datos:", {
        token: tokenUrl,
        passwordNueva: data.passwordNueva,
      });
      resetPasswordMutate({ token: tokenUrl, ...data });
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-6"
      noValidate
    >
      {/* Error general de API */}

      {/* Campo: Nueva contraseña */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-500 ml-1">
          Nueva contraseña
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock
              className="w-5 h-5 text-slate-400 group-focus-within:text-[#6344ee] transition-colors"
              strokeWidth={1.8}
            />
          </div>
          <input
            {...register("passwordNueva")}
            type={mostrarPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`w-full pl-11 pr-12 py-4 bg-slate-50 border rounded-[10px] text-slate-900 font-medium text-sm transition-all duration-200 placeholder:text-slate-300 outline-none focus:bg-white focus:ring-2 focus:ring-[#6344ee]/20 ${
              errors.passwordNueva
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-transparent focus:border-[#6344ee]"
            }`}
          />
          <button
            type="button"
            onClick={() => setMostrarPassword((v) => !v)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#6344ee] transition-colors"
          >
            {mostrarPassword ? (
              <EyeOff className="w-5 h-5" strokeWidth={1.8} />
            ) : (
              <Eye className="w-5 h-5" strokeWidth={1.8} />
            )}
          </button>
        </div>
        {errors.passwordNueva && (
          <p className="text-xs text-red-500 font-medium ml-1">
            {errors.passwordNueva.message}
          </p>
        )}
      </div>

      {/* Campo: Confirmar contraseña */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-500 ml-1">
          Confirmar nueva contraseña
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock
              className="w-5 h-5 text-slate-400 group-focus-within:text-[#6344ee] transition-colors"
              strokeWidth={1.8}
            />
          </div>
          <input
            {...register("confirmarPassword")}
            type={mostrarConfirmar ? "text" : "password"}
            placeholder="••••••••"
            className={`w-full pl-11 pr-12 py-4 bg-slate-50 border rounded-[10px] text-slate-900 font-medium text-sm transition-all duration-200 placeholder:text-slate-300 outline-none focus:bg-white focus:ring-2 focus:ring-[#6344ee]/20 ${
              errors.confirmarPassword
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-transparent focus:border-[#6344ee]"
            }`}
          />
          <button
            type="button"
            onClick={() => setMostrarConfirmar((v) => !v)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#6344ee] transition-colors"
          >
            {mostrarConfirmar ? (
              <EyeOff className="w-5 h-5" strokeWidth={1.8} />
            ) : (
              <Eye className="w-5 h-5" strokeWidth={1.8} />
            )}
          </button>
        </div>
        {errors.confirmarPassword && (
          <p className="text-xs text-red-500 font-medium ml-1">
            {errors.confirmarPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#6344ee] hover:bg-[#4d2ad3] disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 px-6 rounded-[10px] font-bold text-sm active:scale-[0.98] transition-all duration-200 shadow-[0_10px_20px_rgba(99,68,238,0.25)] flex items-center justify-center gap-2 group"
        >
          {isPending ? (
            <svg
              className="animate-spin w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
          ) : (
            <>
              <span>Restablecer contraseña</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
      {ConfirmModal}
    </form>
  );
};

export default FormChangePass;
