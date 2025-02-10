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

export function handleTTS(text: string, idxVoice: number = 0) {
  if ('speechSynthesis' in window) {
    const synthesis = window.speechSynthesis
    const voices = synthesis.getVoices()

    if (!voices.length) {
      // If voices are not loaded yet, wait for the 'voiceschanged' event
      synthesis.addEventListener('voiceschanged', () => {
        handleTTS(text, idxVoice)
      })
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)

    if (voices[idxVoice]) {
      utterance.voice = voices[idxVoice]
    } else {
      console.error('No voice found for the specified index.')
      utterance.voice = voices[0] // Fallback to the first available voice
    }

    synthesis.speak(utterance)
  } else {
    console.error('Text-to-Speech is not supported in this browser.')
  }
}
