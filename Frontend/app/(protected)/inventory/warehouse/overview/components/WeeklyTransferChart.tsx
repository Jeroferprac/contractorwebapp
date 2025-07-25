"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export interface WeeklyTransferDatum {
  day: string;
  inbound: number;
  outbound: number;
}

export function WeeklyTransferChart({ data }: { data: WeeklyTransferDatum[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full h-full"
    >
      <Card className="w-full h-full rounded-2xl shadow-xl border-0 bg-white dark:bg-gray-900 flex flex-col">
        <CardHeader className="pt-4 pb-2 flex items-start">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Weekly Transfer Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full h-full flex-1 p-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="inboundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="outboundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: "#64748b", fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: "#64748b", fontWeight: 600 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ fontWeight: 700, color: "#6366f1" }}
                formatter={(value: any, name: string) => [value, name === "inbound" ? "Inbound" : "Outbound"]}
              />
              <Area
                type="monotone"
                dataKey="inbound"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#inboundGradient)"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "white" }}
              />
              <Area
                type="monotone"
                dataKey="outbound"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#outboundGradient)"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2, fill: "white" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

