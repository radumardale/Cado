'use client'

import React, { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Template ({ children } : { children : React.ReactNode }) {
  const [showAdmin, setShowAdmin] = useState(false)

  const router = useRouter()

  const { data, status } = useSession()
  const user = data?.user

  useEffect(() => {
    if(status !== 'loading'){
      if (user) {
         setShowAdmin(true)
      } else {
        router.push('/login')
      }
    }
  }, [user, router, status])



  return (
    <>
    {
      showAdmin && children
    }
    </>
  )
}
