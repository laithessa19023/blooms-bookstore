'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { FiPercent, FiShoppingCart } from 'react-icons/fi'

export default function HomeDiscountedBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDiscounted = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_discounted', true)
        .order('created_at', { ascending: false })
        .limit(4)

      if (!error) setBooks(data || [])
      setLoading(false)
    }

    fetchDiscounted()
  }, [])

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (!cart.find((b) => b.id === book.id)) {
      cart.push(book)
      localStorage.setItem('cart', JSON.stringify(cart))
      alert('✅ تمت إضافة الكتاب للسلة')
    } else {
      alert('📚 هذا الكتاب موجود مسبقًا في السلة')
    }
  }

  if (!loading && !books.length) return null

  const BookCard = ({ book }) => {
    const img =
      book.image?.startsWith('http') || book.image?.startsWith('/')
        ? book.image
        : '/placeholder.jpg'

    const oldPrice = Number(book.price || 0)
    const newPrice = Number(book.discount_price || 0)

    const discountPct =
      oldPrice > 0 && newPrice > 0 && newPrice < oldPrice
        ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
        : null

    return (
      <div className="group rounded-3xl border bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full relative">
        {/* Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-2 text-[11px] px-3 py-1 rounded-full bg-white/90 border border-white/60 text-[#C05370] font-extrabold">
            <FiPercent />
            {discountPct ? `خصم ${discountPct}%` : 'خصم'}
          </span>
        </div>

        <Link href={`/books/${book.id}`} className="block">
          <div className="relative w-full aspect-[2/3] bg-gray-50">
            <Image
              src={img}
              alt={book.title}
              fill
              sizes="(max-width: 768px) 80vw, 25vw"
              className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>

          <div className="p-4 space-y-2">
            <h3 className="text-sm font-extrabold text-[#2E2A28] line-clamp-2">
              {book.title}
            </h3>

            <p className="text-xs text-gray-600 line-clamp-2">
              {book.description || 'وصف غير متوفر حالياً.'}
            </p>

            <div className="flex items-baseline justify-between gap-2">
              <div className="text-sm font-extrabold text-[#C05370]">
                {newPrice ? `${newPrice.toLocaleString()} ل.س` : 'السعر غير متوفر'}
              </div>

              {oldPrice ? (
                <div className="text-xs text-gray-400 line-through">
                  {oldPrice.toLocaleString()} ل.س
                </div>
              ) : null}
            </div>
          </div>
        </Link>

        <div className="p-4 pt-0 mt-auto">
          <button
            onClick={() => addToCart(book)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C05370] text-white text-sm py-2.5 hover:opacity-90 transition"
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E2A28]">
            🔥 أحدث العروض
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            خصومات مختارة — لفترة محدودة
          </p>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-3xl border bg-white/70 h-[420px] animate-pulse" />
          ))}
        </div>
      )}

      {!loading && (
        <>
          {/* ✅ موبايل: سلايدر */}
          <div className="md:hidden">
            <Swiper
              spaceBetween={14}
              slidesPerView={1.15}
              loop
              autoplay={{ delay: 2800, disableOnInteraction: false }}
              modules={[Autoplay]}
              className="pb-6"
            >
              {books.map((book) => (
                <SwiperSlide key={book.id}>
                  <BookCard book={book} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ✅ ديسكتوب: شبكة */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* زر عرض كل العروض */}
          <div className="mt-6 text-center">
            <Link
              href="/offers"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#C05370] text-[#C05370] font-extrabold hover:bg-[#C05370] hover:text-white transition"
            >
              👀 عرض جميع العروض
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
