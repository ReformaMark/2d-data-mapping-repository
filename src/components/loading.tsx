import { Loader } from 'lucide-react'
import React from 'react'

export default function Loading() {
  return (
    <div className="flex justify-center items-center">
        <Loader className='a animate-spin'/>
    </div>
  )
}