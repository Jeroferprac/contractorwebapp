"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function CalendarDateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<Date>()

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[260px] justify-start text-left font-normal bg-[#020817] border-slate-800 text-white hover:bg-slate-800/50",
              !date && "text-slate-400",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? date.toDateString() : <span>Pick a date range</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-[#020817] border-slate-800" align="end">
          <Calendar
            initialFocus
            mode="single"
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            className="bg-[#020817] text-white"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
