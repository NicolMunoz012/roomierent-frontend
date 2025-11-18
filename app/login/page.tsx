"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { validators } from "@/lib/validation";
import { Home, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validación en tiempo real
  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "email":
        error = validators.email(value) || "";
        break;
      case "password":
        if (!value) {
          error = "La contraseña es obligatoria";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (serverError) setServerError("");

    if (errors[name as keyof typeof errors]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");

    const emailError = validators.email(formData.email);
    const passwordError = formData.password ? null : "La contraseña es obligatoria";

    setErrors({
      email: emailError || "",
      password: passwordError || "",
    });

    if (emailError || passwordError) {
      return;
    }

    setIsLoading(true);

    const sanitizedData = {
      email: validators.sanitize(formData.email).toLowerCase(),
      password: formData.password,
    };

    // ← CAMBIO AQUÍ: Ahora manejamos el resultado como objeto
    const result = await login(sanitizedData.email, sanitizedData.password);

    setIsLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      // Mostrar el mensaje de error del servidor
      setServerError(result.message || "Error al iniciar sesión. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        {/* Logo elegante */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 group"
          >
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="font-serif text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RoomieRent
            </span>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">
            Tu nuevo hogar está más cerca de lo que piensas
          </p>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-blue-100">
          <h2 className="text-2xl font-bold text-center">Bienvenido de nuevo</h2>
          <p className="text-center text-gray-600 mb-6">
            Ingresa a tu cuenta para continuar
          </p>

          {/* Error del servidor */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="••••••••"
                />

                {/* Mostrar / ocultar password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-base text-white font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-95 active:from-orange-700 active:to-orange-800 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                "Iniciando sesión..."
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Registro */}
            <p className="text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Regístrate aquí
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}