"use client"

import { Button } from '@/components/ui/button'
import React from 'react'

const FetchSubmissions = ({ slug }: { slug: string }) => {

  const handleFetchSubmissions = async () => {
    const res = await fetch(`http://localhost:3000/api/events/${slug}/submissions`)
    const data = await res.json()
    console.log(data);
  }

  return (
    <div className="flex justify-end m-5">
      <Button onClick={handleFetchSubmissions}>
        fetch submissions
      </Button>
    </div>
  )
}

export default FetchSubmissions