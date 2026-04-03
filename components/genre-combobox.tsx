'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { genresForPicker } from '@/lib/constants/genres'
import { cn } from '@/lib/utils'

interface GenreComboboxProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  id?: string
  'aria-describedby'?: string
}

/**
 * Searchable single-select for long genre lists (combobox pattern).
 * Prefer this over a native <select> when options exceed ~15 items.
 */
export function GenreCombobox({
  value,
  onChange,
  disabled,
  id,
  'aria-describedby': ariaDescribedBy,
}: GenreComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const options = React.useMemo(() => [...genresForPicker(value)], [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-describedby={ariaDescribedBy}
          disabled={disabled}
          className="w-full justify-between min-h-12 h-auto px-4 py-3 rounded-xl bg-secondary/50 border-border/50 font-normal hover:bg-secondary/70"
        >
          <span className="truncate text-left">{value || 'Select genre'}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-(--radix-popover-trigger-width) max-w-[min(24rem,calc(100vw-2rem))]"
        align="start"
      >
        <Command shouldFilter>
          <CommandInput placeholder="Search genres…" className="h-11" />
          <CommandList className="max-h-[min(18rem,50vh)]">
            <CommandEmpty>No matching genre.</CommandEmpty>
            <CommandGroup heading="Genres">
              {options.map((g) => (
                <CommandItem
                  key={g}
                  value={g}
                  keywords={[g]}
                  onSelect={() => {
                    onChange(g)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4 shrink-0', value === g ? 'opacity-100' : 'opacity-0')}
                    aria-hidden
                  />
                  <span className="truncate">{g}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
