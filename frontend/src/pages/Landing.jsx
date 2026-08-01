import { useEffect } from 'react'
import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import Features from '../components/Features.jsx'
import Testimonials from '../components/Testimonials.jsx'
import CTA from '../components/CTA.jsx'
import Footer from '../components/Footer.jsx'

export default function Landing() {
  useEffect(() => {
    const onScroll = () => {
      const header = document.querySelector('header')
      if (!header) return
      if (window.scrollY > 20) {
        header.classList.add('shadow-md', 'bg-surface')
      } else {
        header.classList.remove('shadow-md')
      }
    }
    window.addEventListener('scroll', onScroll)

    const observerOptions = { threshold: 0.1 }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-8')
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll('.glass-card, [class*="rounded-xl"]')
    elements.forEach((el) => {
      el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8')
      observer.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <Header />
      <main className="pt-24 overflow-hidden">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
