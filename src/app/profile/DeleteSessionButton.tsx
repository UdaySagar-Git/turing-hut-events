"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios'

const DeleteSessionButton = ({ sessionId }: { sessionId: string }) => {

  const handleDelete = async () => {
    await axios.delete(`/api/session/${sessionId}`)
  }

  return (
    <Button onClick={handleDelete}>Delete Session</Button>
  )
}

export default DeleteSessionButton