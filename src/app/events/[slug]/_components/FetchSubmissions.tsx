"use client"

import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useEffect } from 'react'

const FetchSubmissions = ({ contestId }: { contestId?: string }) => {

  const REFRESH_TIME = 5 * 1000 ;

  const handleFetchSubmissions = async () => {
    if (!contestId) {
      return;
    }

    console.log("handleFetchSubmissions",contestId)

    const res = await axios.get(`/api/contest/${contestId}/cf-submissions`)
    const statusData = res.data.statusData.result;
    const addSubmissions = await axios.post(`/api/contest/${contestId}/submissions`, { data: statusData })

    console.log(addSubmissions)
  }

  useEffect(()=>{
    const id= setInterval(handleFetchSubmissions,REFRESH_TIME)
    return ()=>{clearInterval(id)}
  },[])

  return (
    <div className="flex gap-2 m-5 items-center">
      <span>{contestId}</span>
      <Button onClick={handleFetchSubmissions} disabled={!contestId}>
        fetch + db add
      </Button>
      {/* <Button onClick={handleFetchSubmissions} disabled={!contestId} className="bg-[#06553F] hover:bg-[#06553F]/90 text-white font-bold px-4 py-2 rounded  z-10 shadow-md shadow-blue-500 hover:shadow-lg hover:shadow-blue-500 ">
        Fetch + Add DB
      </Button> */}
    </div>
  )
}

export default FetchSubmissions
