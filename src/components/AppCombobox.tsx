'use client'
import { useState, useRef } from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface IAppCombobox {
  value?: string
  options: {
    value: string
    label: string
  }[]
  placeholder?: string
  className?: string
  onChange?: (value: string) => void
}

export function AppCombobox({ value, options, placeholder, className, onChange }: IAppCombobox) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'flex h-9 w-full justify-between rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className,
          )}
        >
          {value ? options.find((opt) => opt.value === value)?.label : placeholder}
          <ChevronsUpDownIcon className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0' style={{ width: buttonRef.current ? buttonRef.current.offsetWidth : 'auto' }}>
        <Command>
          <CommandInput placeholder='Search item...' />
          <CommandList>
            <CommandEmpty>No level found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={(currentValue) => {
                    if (onChange) onChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  {opt.label}
                  <CheckIcon className={cn('ml-auto', value === opt.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
