"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import NFTChatSection from "./components/nft-chat-section"

export default function NFTMarketplace() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Animation for particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number
    }[] = []

    const createParticles = () => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: "#a3ff12",
          alpha: Math.random() * 0.5 + 0.1,
        })
      }
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(163, 255, 18, ${p.alpha})`
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY

        if (p.x > canvas.width) p.x = 0
        if (p.x < 0) p.x = canvas.width
        if (p.y > canvas.height) p.y = 0
        if (p.y < 0) p.y = canvas.height
      }

      requestAnimationFrame(animateParticles)
    }

    createParticles()
    animateParticles()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Page load animation
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30 pointer-events-none" />

      {/* Green glow border effect - adjusted for mobile */}
      <div className="absolute inset-0 border-[1px] border-[#a3ff12] shadow-[0_0_15px_#a3ff12] m-1 sm:m-2 md:m-4 lg:m-8 pointer-events-none"></div>

      {/* Corner brackets - adjusted for mobile */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 md:top-6 md:left-6 w-6 sm:w-8 md:w-12 h-6 sm:h-8 md:h-12 border-t-2 border-l-2 border-[#a3ff12] shadow-[0_0_5px_#a3ff12] pointer-events-none"></div>
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 w-6 sm:w-8 md:w-12 h-6 sm:h-8 md:h-12 border-t-2 border-r-2 border-[#a3ff12] shadow-[0_0_5px_#a3ff12] pointer-events-none"></div>
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 w-6 sm:w-8 md:w-12 h-6 sm:h-8 md:h-12 border-b-2 border-l-2 border-[#a3ff12] shadow-[0_0_5px_#a3ff12] pointer-events-none"></div>
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 w-6 sm:w-8 md:w-12 h-6 sm:h-8 md:h-12 border-b-2 border-r-2 border-[#a3ff12] shadow-[0_0_5px_#a3ff12] pointer-events-none"></div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div
            className={`flex items-center transform transition-all duration-1000 ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}
          >
            <div className="w-6 h-6 rounded-full bg-[#a3ff12] flex items-center justify-center mr-2 animate-pulse">
              <div className="w-4 h-4 rounded-full border-2 border-black"></div>
            </div>
            <span className="text-[#a3ff12] font-bold relative">
              NFTCONNECT
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#a3ff12] grow-underline"></span>
            </span>
          </div>

          <nav
            className={`transform transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"}`}
          >
            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center px-3 py-2 border border-[#a3ff12] text-[#a3ff12]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="text-xs">MENU</span>
            </button>

            {/* Desktop navigation */}
            <ul className="hidden md:flex space-x-1">
              {[
                { name: "EXPLORE NFTS", href: "/explore" },
                { name: "CREATE NFT", href: "/create" },
                { name: "MARKETPLACE", href: "/marketplace" },
                { name: "ABOUT US", href: "/about" },
                { name: "SUPPORT", href: "/support" },
              ].map((item, index) => (
                <li
                  key={item.name}
                  className="transition-all duration-500"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={item.href}
                    className="px-2 py-1 text-xs bg-[#a3ff12] text-black font-semibold hover:bg-opacity-90 transition-all relative overflow-hidden group"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)",
                    }}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile navigation menu */}
            {mobileMenuOpen && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-black border-2 border-[#a3ff12] mt-2 z-50">
                <ul className="flex flex-col">
                  {[
                    { name: "EXPLORE NFTS", href: "/explore" },
                    { name: "CREATE NFT", href: "/create" },
                    { name: "MARKETPLACE", href: "/marketplace" },
                    { name: "ABOUT US", href: "/about" },
                    { name: "SUPPORT", href: "/support" },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block px-4 py-3 text-[#a3ff12] border-b border-gray-700 hover:bg-[#a3ff12] hover:bg-opacity-10 transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
        </header>

        {/* Main content */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div
            className={`flex flex-col justify-center transform transition-all duration-1000 delay-300 ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}
          >
            <h1 className="text-[#a3ff12] font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tighter">
              <div className="overflow-hidden">
                <div className="transform transition-transform duration-1000" style={{ transitionDelay: "300ms" }}>
                  DECENTRALIZED
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="transform transition-transform duration-1000" style={{ transitionDelay: "500ms" }}>
                  NFT EXCHANGE
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="transform transition-transform duration-1000" style={{ transitionDelay: "700ms" }}>
                  PLATFORM
                </div>
              </div>
            </h1>

            <p
              className="text-gray-400 mt-8 text-sm leading-relaxed max-w-md transform transition-all duration-1000"
              style={{ transitionDelay: "900ms" }}
            >
              DIVE INTO THE WORLD OF DIGITAL ART. EASILY CREATE, SELL, AND BUY NFTS WITH THE SECURITY AND TRANSPARENCY
              OF BLOCKCHAIN TECHNOLOGY.
            </p>

            <div
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8 transform transition-all duration-1000"
              style={{ transitionDelay: "1000ms" }}
            >
              <button className="px-4 sm:px-6 py-2 bg-[#a3ff12] text-black font-bold hover:bg-opacity-90 transition-all relative group overflow-hidden text-sm sm:text-base">
                <span className="relative z-10">GET STARTED</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </button>
              <button className="px-4 sm:px-6 py-2 border border-[#a3ff12] text-[#a3ff12] font-bold hover:bg-[#a3ff12] hover:bg-opacity-10 transition-all relative group overflow-hidden text-sm sm:text-base">
                <span className="relative z-10">LEARN MORE</span>
                <span className="absolute inset-0 bg-[#a3ff12] opacity-0 group-hover:opacity-10 transition-opacity"></span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#a3ff12] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </button>
            </div>
          </div>

          <div
            className={`relative transform transition-all duration-1000 delay-500 ${isLoaded ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}
            style={{ transitionDelay: "500ms" }}
          >
            {/* NFT Images */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 relative">
              <div className="col-span-1 row-span-1 relative overflow-hidden rounded-lg border-2 border-[#a3ff12] shadow-[0_0_10px_#a3ff12] group transition-all duration-300 hover:shadow-[0_0_20px_#a3ff12] transform hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 z-10"></div>
                <Image
                  src="/neon-shaman.png"
                  alt="NFT Artwork"
                  width={200}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#a3ff12] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left z-20"></div>
              </div>

              <div className="col-span-1 row-span-2 relative overflow-hidden rounded-lg border-2 border-[#a3ff12] shadow-[0_0_10px_#a3ff12] group transition-all duration-300 hover:shadow-[0_0_20px_#a3ff12] transform hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 z-10"></div>
                <Image
                  src="/neon-zephyr.png"
                  alt="NFT Artwork"
                  width={250}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#a3ff12] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left z-20"></div>
              </div>

              <div className="col-span-1 row-span-1 relative overflow-hidden rounded-lg border-2 border-[#a3ff12] shadow-[0_0_10px_#a3ff12] group transition-all duration-300 hover:shadow-[0_0_20px_#a3ff12] transform hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 z-10"></div>
                <Image
                  src="/emerald-enforcer.png"
                  alt="NFT Artwork"
                  width={200}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#a3ff12] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left z-20"></div>
              </div>
            </div>

            {/* Tech lines */}
            <div className="absolute -top-4 -right-4 w-20 h-20 border-t-2 border-r-2 border-[#a3ff12] opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b-2 border-l-2 border-[#a3ff12] opacity-50"></div>
          </div>
        </main>

        {/* Scroll indicator - hidden on mobile */}
        <div className="hidden sm:block absolute bottom-12 right-12 w-20 h-20 animate-spin-slow">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#a3ff12] rounded-full"></div>
            </div>
            <svg className="w-full h-full text-[#a3ff12]" viewBox="0 0 100 100">
              <path
                d="M 50,50 m 0,-45 a 45,45 0 1,1 0,90 a 45,45 0 1,1 0,-90"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <text
                x="50"
                y="5"
                textAnchor="middle"
                fill="currentColor"
                fontSize="8"
                fontWeight="bold"
                style={{ transform: "rotate(0deg)", transformOrigin: "center" }}
              >
                SCROLL
              </text>
              <text
                x="50"
                y="95"
                textAnchor="middle"
                fill="currentColor"
                fontSize="8"
                fontWeight="bold"
                style={{ transform: "rotate(180deg)", transformOrigin: "center" }}
              >
                SCROLL
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXYxaC0xdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

      {/* Green glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#a3ff12] via-transparent to-transparent opacity-5 pointer-events-none"></div>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-[2px] bg-[#a3ff12] opacity-10 scanline"></div>
      </div>

      {/* NFT Chat Section - Full Width Below Hero */}
      <NFTChatSection />
    </div>
  )
}
