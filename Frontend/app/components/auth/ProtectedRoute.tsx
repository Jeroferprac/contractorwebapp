"use client";
import { useAuth } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { backendAccessToken, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !backendAccessToken) {
      router.replace("/login");
    }
  }, [hydrated, backendAccessToken, router]);

  console.log("ProtectedRoute hydrated:", hydrated, "token:", backendAccessToken);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }
  if (!backendAccessToken) {
    // Optionally, show a spinner or nothing while redirecting
    return null;
  }

  return <>{children}</>;
}
