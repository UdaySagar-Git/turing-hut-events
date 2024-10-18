"use client"

import { Button } from '@/components/ui/button'
import axios from 'axios'
import React from 'react'

const FetchSubmissions = ({ contestId }: { contestId: string }) => {

  const handleFetchSubmissions = async () => {
    if (!contestId) {
      return;
    }
    const res = await axios.get(`/api/contest/${contestId}/cf-submissions`)
    const statusData = res.data.statusData.result;
    const addSubmissions = await axios.post(`/api/contest/${contestId}/submissions`, { data: statusData })

    console.log(addSubmissions)
  }

  return (
    <div className="flex gap-2 m-5 items-center">
      <span>{contestId}</span>
      <Button onClick={handleFetchSubmissions}>
        fetch + db add
      </Button>
    </div>
  )
}

export default FetchSubmissions