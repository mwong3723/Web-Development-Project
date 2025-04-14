'use client'

import dynamic from 'next/dynamic'

const MiniMap = dynamic(() => import('./mini-map'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse" />
})

export default MiniMap
