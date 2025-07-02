"use client";

import { useEffect, useState } from "react";
import { Session } from "next-auth";

interface DashboardClientProps {
  session: Session | null;
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const [stats, setStats] = useState({
    earnings: 0,
    spend: 0,
    sales: 0,
    balance: 0,
    tasks: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        earnings: 23450,
        spend: 4250,
        sales: 1510,
        balance: 1000,
        tasks: 154,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fe] p-4">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-2xl">
        <p>Welcome, {session?.user?.name}!</p>
        <p>Dashboard stats earnings: {stats.earnings}</p>
      </div>
    </div>
  );
}
