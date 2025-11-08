"use client"

import React from "react"
import { Check, X } from "lucide-react"

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const calculateStrength = (pwd: string): number => {
    let strength = 0

    if (pwd.length >= 6) strength += 1
    if (pwd.length >= 10) strength += 1
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 1
    if (/\d/.test(pwd)) strength += 1
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1

    return strength
  }

  const getStrengthData = (strength: number) => {
    if (strength <= 1) {
      return {
        label: "Weak",
        color: "bg-red-500",
        textColor: "text-red-500",
        width: "w-1/3"
      }
    } else if (strength <= 3) {
      return {
        label: "Medium",
        color: "bg-orange-500",
        textColor: "text-orange-500",
        width: "w-2/3"
      }
    } else {
      return {
        label: "Strong",
        color: "bg-green-500",
        textColor: "text-green-500",
        width: "w-full"
      }
    }
  }

  const strength = calculateStrength(password)
  const strengthData = getStrengthData(strength)

  const requirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase & lowercase", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^a-zA-Z0-9]/.test(password) },
  ]

  if (password.length === 0) return null

  return (
    <div className="space-y-2 mt-2">
      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${strengthData.color} transition-all duration-300 ${strengthData.width}`}
        />
      </div>

      {/* Label de fuerza */}
      <p className={`text-sm font-medium ${strengthData.textColor}`}>
        Password strength: {strengthData.label}
      </p>

      {/* Requisitos */}
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-gray-400" />
            )}
            <span className={req.met ? "text-green-700" : "text-gray-500"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}