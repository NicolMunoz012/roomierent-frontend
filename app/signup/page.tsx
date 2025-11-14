"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";

import { Home, User, Building2, Eye, EyeOff } from "lucide-react";

// Backend enum
type UserRole = "TENANT" | "LANDLORD";

// ----------------------------
// VALIDACIONES
// ----------------------------

// NAME
const validateName = (name: string) => {
  const cleaned = name.trim();

  if (!cleaned) return "El nombre es obligatorio";

  if (cleaned.length < 2) return "El nombre debe tener al menos 2 caracteres";

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;
  if (!nameRegex.test(cleaned)) {
    return "El nombre solo puede contener letras y espacios";
  }

  if (/\s{2,}/.test(cleaned)) {
    return "No se permiten múltiples espacios seguidos";
  }

  return "";
};

// EMAIL
const validateEmail = (email: string) => {
  const cleaned = email.trim();

  if (!cleaned) return "El correo es obligatorio";

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(cleaned)) return "Correo inválido";

  return "";
};

// PASSWORD
const validatePassword = (password: string) => {
  if (!password) return "La contraseña es obligatoria";

  if (/\s/.test(password)) return "La contraseña no puede contener espacios";

  if (password.length < 8) return "Debe tener al menos 8 caracteres";

  if (!/[A-Z]/.test(password)) return "Debe contener al menos una mayúscula";

  if (!/[a-z]/.test(password)) return "Debe contener al menos una minúscula";

  if (!/[0-9]/.test(password)) return "Debe contener un número";

  if (!/[@#$%^&+=!]/.test(password)) return "Debe contener un carácter especial (@#$%^&+=!)";

  return "";
};

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

  // ----------------------------
  // CONTROL DE INPUTS
  // ----------------------------

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del servidor
    if (serverError) setServerError("");

    // Validación en tiempo real solo si había error previo
    if (errors[name as keyof typeof errors]) {
      validateField(name, value);
    }
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error || "" }));
    return !error;
  };

  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // ----------------------------
  // SUBMIT
  // ----------------------------

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    // Validar todos los campos
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
      // Sanitizar
      const sanitized = {
        name: formData.name.trim().replace(/\s+/g, " "),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      };

      const success = await signup(
        sanitized.email,
        sanitized.password,
        sanitized.name,
        sanitized.role
      );

      if (success) {
        router.push("/dashboard");
      } else {
        setServerError("El correo ya está registrado.");
      }
    } catch (err: any) {
      console.log("Signup error:", err);

      // Errores del backend (tu ValidationErrorResponse)
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;

        setErrors((prev) => ({
          ...prev,
          ...backendErrors,
        }));
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Error inesperado. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------
  // UI FINAL
  // ----------------------------

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Home className="h-8 w-8 text-primary" />
            <span className="font-serif text-3xl font-bold text-foreground">RoomieRent</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Crear una cuenta</CardTitle>
            <CardDescription>
              Regístrate para encontrar o publicar propiedades
            </CardDescription>
          </CardHeader>

          <CardContent>

            {serverError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME */}
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  placeholder="Ej: Juan Pérez"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                <PasswordStrengthIndicator password={formData.password} />

                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* ROLE */}
              <div>
                <Label>Quiero:</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, role: val as UserRole }))
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="TENANT" id="tenant" className="sr-only peer" />
                    <Label
                      htmlFor="tenant"
                      className="cursor-pointer border p-4 rounded-md peer-data-[state=checked]:border-primary"
                    >
                      <User className="mb-2" />
                      Buscar un hogar
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="LANDLORD" id="landlord" className="sr-only peer" />
                    <Label
                      htmlFor="landlord"
                      className="cursor-pointer border p-4 rounded-md peer-data-[state=checked]:border-primary"
                    >
                      <Building2 className="mb-2" />
                      Publicar propiedad
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* SUBMIT */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Registrarse"}
              </Button>

              <p className="text-center text-sm mt-2">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-primary underline">
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
