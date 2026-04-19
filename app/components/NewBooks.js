'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

function BookCard({ book, onAddToCart }) {
  const imageSrc =
    book.image?.startsWith('http') || book.image?.startsWith('/')
      ? book.image
      : '/placeholder.jpg'

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#f1e6ea] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 sm:h-60 md:h-72 overflow-hidden bg-gradient-to-b from-[#fffafb] to-[#f7f7f7]">
        <Image
          src={imageSrc}
          alt={book.title}
          fill
          className="object-contain p-4 transition duration-300 group-hover:scale-105"
        />

        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#4C7A68] shadow-sm">
          جديد
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 text-right">
        <div className="space-y-2">
          <h3 className="line-clamp-2 min-h-[48px] text-sm sm:text-base font-extrabold leading-6 text-[#2E2A28]">
            {book.title}
          </h3>

          <p className="text-xs sm:text-sm text-gray-500">
            {book.category || 'قسم الكتب'}
          </p>

          <p className="text-sm sm:text-base font-extrabold text-[#C05370]">
            {Number(book.price || 0).toLocaleString()} ل.س
          </p>
        </div>

        <button
          onClick={() => onAddToCart(book)}
          className="mt-4 w-full rounded-full bg-[#C05370] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#a8405b] active:scale-[0.98]"
        >
          أضف إلى السلة 🛒
        </button>
      </div>
    </div>
  )
}

function BookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#f1e6ea] bg-white p-3 shadow-sm animate-pulse">
      <div className="h-48 sm:h-60 md:h-72 rounded-2xl bg-gray-100" />
      <div className="mt-4 h-4 rounded bg-gray-100" />
      <div className="mt-2 h-4 w-2/3 rounded bg-gray-100" />
      <div className="mt-2 h-4 w-1/3 rounded bg-gray-100" />
      <div className="mt-4 h-10 rounded-full bg-gray-100" />
    </div>
  )
}

export default function NewBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('category', 'english') // فقط الكتب الإنجليزية
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) {
        console.error('فشل في جلب الكتب الإنجليزية الجديدة:', error.message)
        setBooks([])
      } else {
        setBooks(data || [])
      }

      setLoading(false)
    }

    fetchBooks()
  }, [])

  const handleAddToCart = (book) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const alreadyInCart = existingCart.find((item) => item.id === book.id)

    if (!alreadyInCart) {
      existingCart.push({
        id: book.id,
        title: book.title,
        price: book.price,
        image: book.image,
      })
      localStorage.setItem('cart', JSON.stringify(existingCart))
      alert(`✅ تم إضافة "${book.title}" إلى السلة`)
    } else {
      alert('📚 هذا الكتاب موجود مسبقًا في السلة')
    }
  }

  return (
    <section className="px-4 py-4 md:py-6 text-right" dir="rtl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2E2A28]">
            📚 الكتب الإنجليزية الجديدة
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            أحدث الكتب الإنجليزية المضافة
          </p>
        </div>

        <Link
          href="/books?filter=english"
          className="inline-flex items-center gap-2 rounded-full border border-[#ead7de] bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#C05370] transition hover:bg-[#fff7fa]"
        >
          عرض الكل
          <span>←</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-10 text-center text-sm text-gray-500">
          لا توجد كتب إنجليزية جديدة حالياً
        </div>
      ) : (
        <>
          <div className="hidden sm:grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <div className="sm:hidden">
            <Swiper
              spaceBetween={12}
              slidesPerView={2}
              loop={books.length > 2}
              autoplay={{
                delay: 3200,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              className="pb-4"
            >
              {books.map((book) => (
                <SwiperSlide key={book.id}>
                  <BookCard book={book} onAddToCart={handleAddToCart} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      )}
    </section>
  )
}