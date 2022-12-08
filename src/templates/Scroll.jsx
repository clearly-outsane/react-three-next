// https://github.com/studio-freight/lenis
// yarn add @studio-freight/lenis
// 1 - wrap <Component {...pageProps} /> with <Scroll /> in _app.jsx
// 2 - add <ScrollTicker /> wherever in the canvas
// 3 - enjoy
import { addEffect, useFrame } from '@react-three/fiber'
import { useFrame as useHamoFrame, useLayoutEffect } from '@studio-freight/hamo'

import Lenis from '@studio-freight/lenis'
import { useEffect, useState } from 'react'
import { useRef } from 'react'
import * as THREE from 'three'

const state = {
  top: 0,
  progress: 0,
}

const { damp } = THREE.MathUtils

export default function Scroll({ children }) {
  const content = useRef(null)
  const wrapper = useRef(null)
  const [lenis, setLenis] = useState(null)

  useLayoutEffect(() => {
    // if (isTouchDevice === undefined) return
    window.scrollTo(0, 0)
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -9 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
      mouseMultiplier: 1,
    })
    window.lenis = lenis
    setLenis(lenis)

    return () => {
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  useEffect(() => {
    if (!lenis) return
    lenis.on('scroll', (e) => {
      state.top = e.scroll
      state.progress = e.progress
      console.log(e)
    })
    lenis.notify()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis])

  useHamoFrame((time) => {
    lenis?.raf(time)
  }, [])

  return (
    <>
      <div>{children}</div>
    </>
  )
}

export const ScrollTicker = ({ smooth = 9999999 }) => {
  useFrame(({ viewport, camera }, delta) => {
    camera.position.y = damp(camera.position.y, -state.progress * viewport.height, smooth, delta)
  })

  return null
}
