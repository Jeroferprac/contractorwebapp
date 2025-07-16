"use client"

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect, useRef } from "react";

const activities = [
  { action: "Ordered", count: 11, product: "Macbook Pro", name: "Grace", surname: "Moreta", avatar: "", time: "1 m ago" },
  { action: "Ordered", count: 11, product: "iPhone 14 pro", name: "Allison", surname: "Siphon", avatar: "", time: "12m ago" },
  { action: "Ordered", count: 11, product: "Zoom75", name: "Makenna", surname: "Doman", avatar: "", time: "23 m ago" },
  { action: "Ordered", count: 11, product: "Galaxy Fold", name: "John", surname: "Doe", avatar: "", time: "1 h ago" },
];

export function RecentActivitySlideshow() {
  const [current, setCurrent] = useState(0);
  const apiRef = useRef<CarouselApi | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance every 2 seconds
  useEffect(() => {
    if (!apiRef.current) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!apiRef.current) return;
      const next = (apiRef.current.selectedScrollSnap() + 1) % activities.length;
      apiRef.current.scrollTo(next);
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [apiRef.current]);

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="font-semibold text-lg mb-4 w-full text-left">Recent Activity</h2>
      <Carousel
        opts={{ align: "center", loop: true }}
        className="w-full max-w-[700px] overflow-hidden"
        setApi={api => {
          apiRef.current = api;
          if (!api) return;
          api.on("select", () => setCurrent(api.selectedScrollSnap()));
        }}
      >
        <CarouselContent className="-ml-4 cursor-grab">
          {activities.map((activity, i) => {
            // Responsive card style: no pointerEvents
            const style = {
              opacity: current === i ? 1 : 0.5,
              transform: current === i ? "scale(1)" : "scale(0.92)",
              transition: "all 0.3s cubic-bezier(.4,1,.4,1)",
            };
            return (
              <CarouselItem
                key={i}
                className="pl-4 basis-full h-[140px] md:basis-1/2 md:h-[120px] lg:basis-1/3 lg:h-[110px]"
                style={{
                  opacity: current === i ? 1 : 0.5,
                  transform: current === i ? "scale(1)" : "scale(0.92)",
                  transition: "all 0.3s cubic-bezier(.4,1,.4,1)",
                }}
                tabIndex={0}
                aria-label={`Recent activity card ${i + 1}`}
              >
                <Card className="h-full flex flex-col justify-between">
                  <CardContent className="p-5 flex flex-col h-full w-full justify-between">
                    <div className="font-semibold text-base mb-2">
                      {activity.action} <span className="text-blue-500 font-bold">{activity.count}</span> Products
                    </div>
                    <div className="flex items-center mt-2">
                      {activity.avatar ? (
                        <img src={activity.avatar} className="w-9 h-9 rounded-full mr-3 object-cover border border-gray-200" alt={activity.name} />
                      ) : (
                        <div className="w-9 h-9 rounded-full mr-3 bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg border border-gray-200">
                          {activity.product?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 leading-tight text-sm">{activity.name}</span>
                        <span className="text-xs text-gray-500 leading-tight">{activity.surname}</span>
                      </div>
                      <span className="ml-auto text-xs text-blue-400 font-medium">{activity.time}</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex justify-center mt-4 gap-2">
        {activities.map((_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all duration-200 ${i === current ? "bg-blue-500 scale-110" : "bg-gray-300"} w-4 h-4 md:w-3 md:h-3`}
          />
        ))}
      </div>
    </div>
  );
}
