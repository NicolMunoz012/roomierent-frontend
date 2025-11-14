export const validators = {
  email: (email: string): string | null => {
    const trimmed = email.trim();
    
    if (!trimmed) {
      return 'El email es obligatorio';
    }
    
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return 'El formato del email no es válido';
    }
    
    if (trimmed.length > 100) {
      return 'El email no puede exceder 100 caracteres';
    }
    
    return null;
  },

  password: (password: string): string | null => {
    if (!password) {
      return 'La contraseña es obligatoria';
    }
    
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (password.length > 100) {
      return 'La contraseña no puede exceder 100 caracteres';
    }
    
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una mayúscula';
    }
    
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una minúscula';
    }
    
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    
    if (!/[@#$%^&+=!]/.test(password)) {
      return 'La contraseña debe contener al menos un carácter especial (@#$%^&+=!)';
    }
    
    if (/\s/.test(password)) {
      return 'La contraseña no puede contener espacios';
    }
    
    return null;
  },

  name: (name: string, fieldName: string = 'nombre'): string | null => {
    const trimmed = name.trim();
    
    if (!trimmed) {
      return `El ${fieldName} es obligatorio`;
    }
    
    if (trimmed.length < 2) {
      return `El ${fieldName} debe tener al menos 2 caracteres`;
    }
    
    if (trimmed.length > 50) {
      return `El ${fieldName} no puede exceder 50 caracteres`;
    }
    
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(trimmed)) {
      return `El ${fieldName} solo puede contener letras`;
    }
    
    return null;
  },

  phone: (phone: string): string | null => {
    const cleaned = phone.replace(/[\s()-]/g, '');
    
    if (!cleaned) {
      return 'El teléfono es obligatorio';
    }
    
    if (!/^[0-9]+$/.test(cleaned)) {
      return 'El teléfono solo puede contener números';
    }
    
    if (cleaned.length < 7 || cleaned.length > 15) {
      return 'El teléfono debe tener entre 7 y 15 dígitos';
    }
    
    return null;
  },

  sanitize: (input: string): string => {
    return input.trim();
  }
};

export const getPasswordStrength = (password: string): {
  strength: 'weak' | 'medium' | 'strong';
  percentage: number;
} => {
  let score = 0;
  
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[a-z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 15;
  if (/[@#$%^&+=!]/.test(password)) score += 15;
  
  if (score < 50) return { strength: 'weak', percentage: score };
  if (score < 80) return { strength: 'medium', percentage: score };
  return { strength: 'strong', percentage: score };
};