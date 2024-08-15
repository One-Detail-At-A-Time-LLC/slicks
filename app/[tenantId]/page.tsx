import React from 'react'

const page = () => {
  return (
    <div>
      Welcome To {tenantId}
    </div>
  )
}

export function page ({ tenantId }: { tenantId: string })
