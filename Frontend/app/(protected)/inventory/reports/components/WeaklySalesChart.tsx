import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 8 hours (9am-4pm) x 7 days
const salesData = [
  [1, 2, 0, 1, 3, 2, 1], // 9:00
  [2, 1, 3, 2, 1, 4, 2], // 10:00
  [0, 3, 1, 2, 3, 1, 2], // 11:00
  [1, 2, 4, 1, 2, 3, 1], // 12:00
  [3, 1, 2, 3, 1, 2, 4], // 13:00
  [2, 3, 1, 2, 4, 1, 3], // 14:00
  [1, 2, 2, 3, 2, 1, 2], // 15:00
  [2, 1, 3, 2, 1, 4, 2], // 16:00
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const getIntensityColor = (intensity: number) => {
  const colors = [
    "bg-cyan-50", // 0 - lightest
    "bg-cyan-100", // 1
    "bg-cyan-200", // 2
    "bg-cyan-400", // 3
    "bg-cyan-600", // 4 - darkest
  ];
  return colors[intensity] || colors[0];
};

export function WeeklySalesChart() {
  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Weekly Sales</CardTitle>
        <div className="text-sm text-gray-500">Aug 19-25</div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="overflow-x-auto">
          {/* Days header */}
          <div className="grid grid-cols-8 gap-1 mb-2 min-w-[600px]">
            <div></div> {/* Empty cell for hour labels */}
            {days.map((day, index) => (
              <div key={index} className="text-xs text-gray-500 text-center font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid - Rectangular cells */}
          {salesData.map((row, hourIdx) => (
            <div key={hourIdx} className="grid grid-cols-8 gap-1 min-w-[600px]">
              {/* Hour label */}
              <div className="text-xs text-gray-500 font-medium flex items-center w-14">{hours[hourIdx]}</div>
              {/* Day cells */}
              {row.map((intensity, dayIdx) => (
                <div
                  key={dayIdx}
                  className={`w-10 h-5 rounded ${getIntensityColor(intensity)} hover:ring-2 hover:ring-cyan-300 cursor-pointer transition-all duration-200`}
                  title={`Sales intensity: ${intensity}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend - More compact */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((intensity) => (
              <div key={intensity} className={`w-4 h-4 rounded ${getIntensityColor(intensity)}`} />
            ))}
          </div>
          <span>More</span>
        </div>

        {/* Sales values - More compact */}
        <div className="flex justify-between mt-3 text-xs">
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 bg-cyan-100 rounded mr-1.5"></div>
            <span className="text-gray-600">$0-1K</span>
          </div>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 bg-cyan-200 rounded mr-1.5"></div>
            <span className="text-gray-600">$1K-5K</span>
          </div>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 bg-cyan-600 rounded mr-1.5"></div>
            <span className="text-gray-600">$5K+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
