import { clsx, type ClassValue } from "clsx"
import { cubicBezier } from "motion/react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);