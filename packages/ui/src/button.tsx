"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
  },
  secondary: {
    backgroundColor: "#666",
    color: "#fff",
    border: "none",
  },
  outline: {
    backgroundColor: "transparent",
    color: "#0070f3",
    border: "2px solid #0070f3",
  },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: "6px 12px", fontSize: "13px" },
  md: { padding: "10px 20px", fontSize: "15px" },
  lg: { padding: "14px 28px", fontSize: "17px" },
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  style,
  ...props
}: ButtonProps): JSX.Element => {
  return (
    <button
      style={{
        borderRadius: "8px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "opacity 0.2s",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
