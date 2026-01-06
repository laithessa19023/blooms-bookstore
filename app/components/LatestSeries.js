'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { FiShoppingCart, FiPackage } from 'react-icons/fi'

export default function LatestSeries() {
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)

      if (!error) setSeries(data || [])
      setLoading(false)
    }

    fetchSeries()
  }, [])

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    localStorage.setItem(
      'cart',
      JSON.stringify([
        ...cart,
        {
          id: `series-${item.id}`,
          title: item.title,
          price: item.price,
          image: item.image,
          type: 'series',
        },
      ])
    )
    alert(`✅ تمت إضافة "${item.title}" إلى السلة`)
  }

  if (!loading && !series.length) return null

  const SeriesCard = ({ item }) => {
    const img =
      item.image?.startsWith('http') || item.image?.startsWith('/')
        ? item.image
        : '/placeholder.jpg'

    return (
      <div className="group rounded-3xl border bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full">
        <Link href={`/series/${item.id}`} className="relative w-full h-56 bg-gray-50 block">
          <Image
            src={img}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 80vw, 25vw"
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
          />

          <div className="absolute top-3 right-3">
            <span className="text-[11px] px-3 py-1 rounded-full bg-white/90 border border-white/60 text-[#C05370] font-bold">
              سلسلة جديدة
            </span>
          </div>
        </Link>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-extrabold text-[#2E2A28] text-sm sm:text-base line-clamp-2">
            {item.title}
          </h3>

          <div className="mt-2 text-sm font-extrabold text-[#4C7A68]">
            {item.price ? `${Number(item.price).toLocaleString()} ل.س` : 'السعر غير متوفر'}
          </div>

          <button
            onClick={() => addToCart(item)}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#C05370] text-white text-sm py-2.5 hover:opacity-90 transition"
          >
            <FiShoppingCart /> أضف إلى السلة
          </button>
        </div>
      </div>
    )
  }

  return (
    <section dir="rtl" className="px-4 py-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E2A28] flex items-center gap-2">
            <FiPackage className="text-[#C05370]" /> سلاسل جديدة
          </h2>
          <p className="text-sm text-gray-600 mt-1">آخر السلاسل المضافة — اختر سلسلة كاملة بضغطة</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-3xl border bg-white/70 h-[340px] animate-pulse" />
          ))}
        </div>
      )}

      {!loading && (
        <>
          {/* ✅ Grid للديسكتوب */}
          <div className="hidden md:grid grid-cols-4 gap-5">
            {series.map((item) => (
              <SeriesCard key={item.id} item={item} />
            ))}
          </div>

          {/* ✅ سلايدر للموبايل */}
          <div className="md:hidden">
            <Swiper
              spaceBetween={14}
              slidesPerView={1.15}
              loop
              autoplay={{ delay: 2800, disableOnInteraction: false }}
              modules={[Autoplay]}
              className="pb-6"
            >
              {series.map((item) => (
                <SwiperSlide key={item.id}>
                  <SeriesCard item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ✅ زر عرض الكل */}
          <div className="mt-6 text-center">
            <Link
              href="/series"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#C05370] text-[#C05370] font-bold hover:bg-[#C05370] hover:text-white transition"
            >
              👀 عرض كل السلاسل
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
