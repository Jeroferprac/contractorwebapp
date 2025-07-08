import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <div className="relative overflow-hidden bg-white rounded-xl border shadow">
      <div className="h-32 md:h-40 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-gray-200" />
        </div>
      </div>
      <div className="px-6 pb-6 bg-white">
        <div className="flex flex-col items-center text-center pt-14">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-20 mb-6" />
        </div>
      </div>
    </div>
  );
} 