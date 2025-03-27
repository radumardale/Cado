"use client"

import { ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'

const SmoothScroll = ({ children } : { children: ReactNode }) => {
    return (
    <ReactLenis options={{
        lerp: 0.1
    }} root>
      { children }
    </ReactLenis>
    )
}

export default SmoothScroll