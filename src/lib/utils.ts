import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function keyValueTemplate(
  rowData: Record<string, any>,
  field: string,
  kvData: { value: string; label: string }[],
) {
  if (kvData && kvData.length) {
    // Find the item based on value for { value, label } structure
    return kvData.find((d) => d.value === rowData[field])?.label || ''
  }
  return ''
}
