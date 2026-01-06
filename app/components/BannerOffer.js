'use client'

export default function BannerOffer() {
  const text = '🎁 كتاب مجاني لكل طلب تتجاوز قيمته 500,000 ل.س'

  return (
    <div className="relative overflow-hidden border-b bg-gradient-to-l from-[#C05370] via-[#d96c85] to-[#C05370]">
      <div
        className="
          animate-marquee
          whitespace-nowrap
          text-white
          font-semibold
          text-sm
          md:text-base
          py-2
          hover:[animation-play-state:paused]
        "
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-10 inline-flex items-center gap-2">
            <span className="animate-pulse">✨</span>
            {text}
          </span>
        ))}
      </div>

      {/* تدرّج خفيف للأطراف */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#C05370]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#C05370]" />
    </div>
  )
}
