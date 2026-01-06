'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { FiBookOpen } from 'react-icons/fi'

export default function LatestManga() {
  const [manga, setManga] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchManga = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('manga')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)

      if (!error) setManga(data || [])
      setLoading(false)
    }

    fetchManga()
  }, [])

  if (!loading && !manga.length) return null

  const MangaCard = ({ item }) => {
    const img =
      item.image?.startsWith('http') || item.image?.startsWith('/')
        ? item.image
        : '/placeholder.jpg'

    return (
      <Link
        href={`/manga/${item.id}`}
        className="group rounded-3xl border bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full"
      >
        <div className="relative w-full h-56 bg-gray-50">
          <Image
            src={img}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 80vw, 25vw"
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
          />

          <div className="absolute top-3 right-3">
            <span className="text-[11px] px-3 py-1 rounded-full bg-white/90 border border-white/60 text-[#C05370] font-bold">
              مانجا جديدة
            </span>
          </div>
        </div>

        <div className="p-4 flex-1">
          <h3 className="font-extrabold text-[#2E2A28] text-sm sm:text-base line-clamp-2">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {item.description || 'وصف غير متوفر حالياً.'}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <section dir="rtl" className="px-4 py-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E2A28] flex items-center gap-2">
            <FiBookOpen className="text-[#C05370]" /> مانجا جديدة
          </h2>
          <p className="text-sm text-gray-600 mt-1">آخر ما تم إضافته من عالم المانجا</p>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-3xl border bg-white/70 h-[320px] animate-pulse" />
          ))}
        </div>
      )}

      {!loading && (
        <>
          {/* ✅ Grid للديسكتوب */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* أول 3 كروت */}
            {manga.slice(0, 3).map((item) => (
              <MangaCard key={item.id} item={item} />
            ))}

            {/* الكرت الرابع عرض الكل */}
            <Link
              href="/manga"
              className="rounded-3xl border border-dashed border-[#C05370]
                         bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition
                         flex flex-col items-center justify-center text-center p-6"
            >
              <div className="text-3xl mb-2">👀</div>
              <div className="text-lg font-extrabold text-[#C05370]">عرض كل المانجا</div>
              <div className="text-sm text-gray-600 mt-1">تصفح جميع الإضافات</div>
            </Link>
          </div>

          {/* ✅ سلايدر للموبايل */}
          <div className="sm:hidden">
            <Swiper
              spaceBetween={14}
              slidesPerView={1.15}
              loop
              autoplay={{ delay: 2800, disableOnInteraction: false }}
              modules={[Autoplay]}
              className="pb-6"
            >
              {manga.map((item) => (
                <SwiperSlide key={item.id}>
                  <MangaCard item={item} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-2">
              <Link
                href="/manga"
                className="block w-full text-center rounded-full border border-[#C05370]
                           text-[#C05370] font-extrabold py-3 hover:bg-[#C05370] hover:text-white transition"
              >
                👀 عرض كل المانجا
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
