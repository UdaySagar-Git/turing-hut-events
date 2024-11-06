"use client"

import { Button } from "@/components/ui/button"
import axios from "axios"
import React, { useEffect, useState } from "react"

const FetchSubmissions = ({ contestId }: { contestId?: string }) => {
  const [refreshTime, setRefreshTime] = useState(30 * 1000)
  const [inputTime, setInputTime] = useState("30")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [nextRefresh, setNextRefresh] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [autoRefetch, setAutoRefetch] = useState(false)

  const handleFetchSubmissions = async () => {
    if (!contestId) {
      return;
    }

    setIsRefreshing(true)

    try {
      const res = await axios.get(`/api/contest/${contestId}/cf-submissions`)
      const statusData = res.data.statusData.result;
      const addSubmissions = await axios.post(`/api/contest/${contestId}/submissions`, { data: statusData })

      setNextRefresh(Date.now() + refreshTime)
    } catch (error) {
      console.error(error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (!autoRefetch) return;

    handleFetchSubmissions()
    const id = setInterval(() => {
      handleFetchSubmissions()
    }, refreshTime)
    return () => { clearInterval(id) }
  }, [refreshTime, autoRefetch])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value)
    if (!isNaN(newTime)) {
      setInputTime(e.target.value)
      setRefreshTime(newTime * 1000)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (nextRefresh) {
        const remaining = Math.max(0, Math.floor((nextRefresh - Date.now()) / 1000))
        setTimeLeft(remaining)
        if (remaining <= 0) {
          setNextRefresh(null)
          setTimeLeft(null)
        }
      }
    }, 100)
    return () => clearInterval(timer)
  }, [nextRefresh])

  return (
    <div className="flex flex-col gap-2 m-5">
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={inputTime}
          onChange={handleTimeChange}
          className="w-16 px-1 py-1 border rounded"
          min="1"
        />
        <span>sec</span>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoRefetch}
            onChange={(e) => setAutoRefetch(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="autoRefetch">Auto Refetch</label>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span>{contestId}</span>
          <Button onClick={handleFetchSubmissions} disabled={!contestId || isRefreshing}>
            fetch + db add
          </Button>
        </div>
        {isRefreshing && (
          <span className="text-sm text-gray-500">Refreshing...</span>
        )}
        {timeLeft !== null && !isRefreshing && autoRefetch && (
          <span className="text-sm text-gray-500">
            Next refresh in {timeLeft}s
          </span>
        )}
      </div>
    </div>
  )
}

export default FetchSubmissions
