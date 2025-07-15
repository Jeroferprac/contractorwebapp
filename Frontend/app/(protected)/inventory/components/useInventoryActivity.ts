import { useRef } from "react";

export interface Activity {
  action: string;
  item: string;
  time: string;
}

// This hook provides a persistent (per session) activity log for inventory pages only.
export function useInventoryActivity() {
  // Use a ref so activity is shared across all uses in the session (not reset on re-render)
  const activityRef = useRef<Activity[]>([]);

  // Add a new activity (most recent first, keep last 20)
  function addActivity(activity: Activity) {
    activityRef.current = [activity, ...activityRef.current.slice(0, 19)];
  }

  // Get the current activity list
  function getActivities() {
    return activityRef.current;
  }

  return { addActivity, getActivities };
} 
 