import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "@/lib/utils"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

export function DatePicker({ value, onChange, min, max, className }: {
  value: string,
  onChange: (date: string) => void,
  min?: string,
  max?: string,
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const selected = value ? new Date(value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow focus:shadow-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all text-base font-medium focus:outline-none outline-none appearance-none",
            className
          )}
          onClick={() => setOpen((v) => !v)}
        >
          <CalendarIcon className="w-5 h-5 text-indigo-400" />
          {value ? value.split("-").reverse().join("/") : "dd/mm/aaaa"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-2 w-auto bg-white rounded-xl shadow-xl border border-gray-100">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={date => {
            if (date) {
              const iso = date.toISOString().slice(0, 10)
              onChange(iso)
              setOpen(false)
            }
          }}
          fromDate={min ? new Date(min) : undefined}
          toDate={max ? new Date(max) : undefined}
          modifiersClassNames={{
            selected: "bg-indigo-500 text-white",
            today: "border border-indigo-400"
          }}
          className="rounded-xl"
        />
      </PopoverContent>
    </Popover>
  )
}
