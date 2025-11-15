"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";

import { Home, User, Building2, Eye, EyeOff } from "lucide-react";

type UserRole = "TENANT" | "LANDLORD";

// VALIDACIONES --------------------

const validateName = (name: string) => {
  const cleaned = name.trim();
  if (!cleaned) return "El nombre es obligatorio";
  if (cleaned.length < 2) return "El nombre debe tener al menos 2 caracteres";
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;
  if (!nameRegex.test(cleaned)) return "Solo puede contener letras y espacios";
  if (/\s{2,}/.test(cleaned))
    return "No se permiten múltiples espacios seguidos";
  return "";
};

const validateEmail = (email: string) => {
  const cleaned = email.trim();
  if (!cleaned) return "El correo es obligatorio";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(cleaned)) return "Correo inválido";
  return "";
};

const validatePassword = (password: string) => {
  if (!password) return "La contraseña es obligatoria";
  if (/\s/.test(password)) return "No puede contener espacios";
  if (password.length < 8) return "Debe tener al menos 8 caracteres";
  if (!/[A-Z]/.test(password)) return "Debe contener una mayúscula";
  if (!/[a-z]/.test(password)) return "Debe contener una minúscula";
  if (!/[0-9]/.test(password)) return "Debe contener un número";
  if (!/[@#$%^&+=!]/.test(password))
    return "Debe contener un carácter especial (@#$%^&+=!)";
  return "";
};

// COMPONENTE --------------------

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TENANT" as UserRole,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { signup } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let finalValue = value;
    if (name === "password") {
      finalValue = value.replace(/\s+/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    if (serverError) setServerError("");
    if (errors[name as keyof typeof errors]) {
      validateField(name, finalValue);
    }
  };

  const validateField = (name: string, value: string) => {
    let err = "";
    if (name === "name") err = validateName(value);
    if (name === "email") err = validateEmail(value);
    if (name === "password") err = validatePassword(value);
    setErrors((p) => ({ ...p, [name]: err || "" }));
    return !err;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passError = validatePassword(formData.password);

    setErrors({
      name: nameError,
      email: emailError,
      password: passError,
    });

    if (nameError || emailError || passError) return;

    setIsLoading(true);

    try {
      const sanitized = {
        name: formData.name.trim().replace(/\s+/g, " "),
        email: formData.email.trim().toLowerCase().replace(/\s+/g, ""),
        password: formData.password.trim().replace(/\s+/g, ""),
        role: formData.role,
      };

      const success = await signup(
        sanitized.email,
        sanitized.password,
        sanitized.name,
        sanitized.role
      );

      if (success) router.push("/dashboard");
      else setServerError("El correo ya está registrado.");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors((p) => ({ ...p, ...err.response.data.errors }));
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Error inesperado. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // UI --------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* HEADER LOGO */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:opacity-80 transition"
          >
            <Home className="h-10 w-10 text-primary" />
            <span className="font-serif text-4xl font-extrabold tracking-tight text-gray-900">
              RoomieRent
            </span>
          </Link>
        </div>

        <Card className="shadow-2xl border-none rounded-2xl bg-white/90 backdrop-blur-xl">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Crear una cuenta
            </CardTitle>
            <CardDescription className="text-base">
              Regístrate para encontrar o publicar propiedades
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* NAME */}
              <div className="space-y-1">
                <Label htmlFor="name" className="font-medium">
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={(e) => validateField("name", e.target.value)}
                  disabled={isLoading}
                  className="h-12 rounded-xl text-base"
                  placeholder="Ej: Juan Pérez"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name}</p>
                )}
              </div>

              {/* EMAIL */}
              <div className="space-y-1">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(e) => validateField("email", e.target.value)}
                  disabled={isLoading}
                  className="h-12 rounded-xl text-base"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={(e) => validateField("password", e.target.value)}
                    disabled={isLoading}
                    className="h-12 pr-12 rounded-xl text-base"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 transition"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                <PasswordStrengthIndicator password={formData.password} />

                {errors.password && (
                  <p className="text-red-600 text-sm">{errors.password}</p>
                )}
              </div>

              {/* ROLE */}
              <div className="space-y-2">
                <Label className="font-medium">Quiero:</Label>

                <RadioGroup
                  value={formData.role}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, role: v as UserRole }))
                  }
                  className="grid grid-cols-2 gap-3"
                >
                  {/* TENANT */}
                  <div className="relative">
                    <RadioGroupItem
                      value="TENANT"
                      id="tenant"
                      className="sr-only peer"
                    />
                    <Label
                      htmlFor="tenant"
                      className="flex flex-col items-center border rounded-xl p-4 cursor-pointer bg-white shadow-sm peer-data-[state=checked]:border-primary peer-data-[state=checked]:shadow-md hover:bg-gray-50 transition"
                    >
                      <User className="mb-2" />
                      Buscar hogar
                    </Label>
                  </div>

                  {/* LANDLORD */}
                  <div className="relative">
                    <RadioGroupItem
                      value="LANDLORD"
                      id="landlord"
                      className="sr-only peer"
                    />
                    <Label
                      htmlFor="landlord"
                      className="flex flex-col items-center border rounded-xl p-4 cursor-pointer bg-white shadow-sm peer-data-[state=checked]:border-primary peer-data-[state=checked]:shadow-md hover:bg-gray-50 transition"
                    >
                      <Building2 className="mb-2" />
                      Publicar propiedad
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:opacity-90 transition"
              >
                {isLoading ? "Creando cuenta..." : "Registrarse"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium underline hover:opacity-80"
                >
                  Iniciar sesión
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
