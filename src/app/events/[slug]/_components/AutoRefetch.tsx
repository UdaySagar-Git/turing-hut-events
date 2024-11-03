"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const AutoRefresh = ({ onRefresh }: { onRefresh: () => void }) => {
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState<number>(refreshInterval);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoRefreshEnabled) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onRefresh();
            return refreshInterval;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [refreshInterval, onRefresh, autoRefreshEnabled]);

  return (
    <div className="flex items-center gap-4 mb-1 mt-4 p-1 justify-center">
      <div className="flex items-center gap-2">
        <Checkbox
          id="auto-refresh"
          checked={autoRefreshEnabled}
          onCheckedChange={(checked) => setAutoRefreshEnabled(checked as boolean)}
        />
        <label
          htmlFor="auto-refresh"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          Auto Refresh
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="15"
          value={refreshInterval}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Number(e.target.value);

            if (value < 15) {
              return;
            }

            setRefreshInterval(value);
            setTimeLeft(value);
          }}
          className="w-20 h-8 text-sm"
          disabled={!autoRefreshEnabled}
        />
        <span className="text-sm text-gray-600">seconds</span>
      </div>

      {autoRefreshEnabled && (
        <span className="text-sm text-gray-500">
          (refreshing in {timeLeft}s)
        </span>
      )}
    </div>
  );
};

export default AutoRefresh;