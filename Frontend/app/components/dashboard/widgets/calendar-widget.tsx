import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CalendarWidget() {
  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
  const calendarDays = [
    null,
    null,
    null,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    null,
    null,
  ]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">April</CardTitle>
          <div className="text-sm text-gray-500">2021</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                text-center text-sm py-2 cursor-pointer rounded
                ${day === null ? "" : "hover:bg-gray-100"}
                ${day === 27 ? "bg-purple-500 text-white" : ""}
                ${day === 30 ? "bg-blue-500 text-white" : ""}
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
