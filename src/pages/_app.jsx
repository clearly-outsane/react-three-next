import { useRef } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/config'
import Layout from '@/components/dom/Layout'
import '@/styles/index.css'
import Scroll, { ScrollTicker } from '@/templates/Scroll'

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: true })

export default function App({ Component, pageProps = { title: 'index' } }) {
  const ref = useRef()
  return (
    <>
      <Header title={pageProps.title} />{' '}
      <Layout ref={ref}>
        <Scroll>
          <Component {...pageProps} />
          {/* The canvas can either be in front of the dom or behind. If it is in front it can overlay contents.
           * Setting the event source to a shared parent allows both the dom and the canvas to receive events.
           * Since the event source is now shared, the canvas would block events, we prevent that with pointerEvents: none. */}
          {Component?.canvas && (
            <div className='fixed top-0 bottom-0 left-0 right-0 pointer-events-none'>
              <Scene className='pointer-events-none' eventSource={ref} eventPrefix='client'>
                <ScrollTicker />
                {Component.canvas(pageProps)}
              </Scene>
            </div>
          )}
        </Scroll>
      </Layout>
    </>
  )
}
