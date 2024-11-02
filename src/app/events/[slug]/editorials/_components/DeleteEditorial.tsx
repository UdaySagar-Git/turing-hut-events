"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'


function DeleteEditorial({editorialId}:{editorialId:string}) {
  const router=useRouter()
  const onDelete=async()=>{
    try {
      const res= await axios.delete(`/api/events/delete-editorial/${editorialId}`);
      if(res.data.success){
        toast.success("Deleted Editorial")
      }
      else{
        throw new Error("Failed to delete")
      }
      router.back()
    } catch (error) {
      toast.error("Failed to delete")
      console.error(error)
    }
  }
  return (
    <button onClick={onDelete} className='text-red-400 hover:text-red-600 shadow-lg hover:shadow-xl border p-1' ><Trash2/></button>
  )
}

export default DeleteEditorial;
