'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

function ArabicBookCard({ book, onAddToCart }) {
  const imageSrc =
    book.image?.startsWith('http') || book.image?.startsWith('/')
      ? book.image
      : '/fallback.jpg'

  return (
    <div className="group overflow-hidden rounded-[26px] border border-[#f1e6ea] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-56 md:h-64 overflow-hidden bg-gradient-to-b from-[#fffafb] to-[#f7f7f7]">
        <Image
          src={imageSrc}
          alt={book.title}
          fill
          className="object-contain p-4 transition duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#4C7A68] shadow-sm">
          كتب عربية
        </div>
      </div>

      <div className="p-5 text-right space-y-3">
        <h3 className="line-clamp-2 min-h-[52px] text-base font-extrabold leading-7 text-[#2E2A28]">
          {book.title}
        </h3>

        <p className="text-lg font-extrabold text-[#C05370]">
          {Number(book.price || 0).toLocaleString()} ل.س
        </p>

        <div className="flex flex-col gap-2 pt-2">
          <Link
            href={`/books/${book.id}`}
            className="rounded-full border border-[#e8dce1] bg-white py-2.5 text-center text-sm font-bold text-[#2E2A28] transition hover:bg-[#faf7f8]"
          >
            عرض التفاصيل
          </Link>

          <button
            onClick={() => onAddToCart(book)}
            className="rounded-full bg-[#C05370] py-2.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#ab4862] active:scale-[0.98]"
          >
            🛒 إضافة للسلة
          </button>
        </div>
      </div>
    </div>
  )
}

function ArabicBookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-[#f1e6ea] bg-white p-4 shadow-sm animate-pulse">
      <div className="h-56 md:h-64 rounded-2xl bg-gray-100" />
      <div className="mt-4 h-4 rounded bg-gray-100" />
      <div className="mt-2 h-4 w-2/3 rounded bg-gray-100" />
      <div className="mt-4 h-10 rounded-full bg-gray-100" />
      <div className="mt-2 h-10 rounded-full bg-gray-100" />
    </div>
  )
}

export default function ArabicBooksSection() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArabicBooks = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('category', 'arabic')
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) {
        console.error('فشل في جلب الكتب العربية:', error.message)
        setBooks([])
      } else {
        setBooks(data || [])
      }

      setLoading(false)
    }

    fetchArabicBooks()
  }, [])

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const alreadyInCart = cart.find((item) => item.id === book.id)

    if (alreadyInCart) {
      alert('📚 هذا الكتاب موجود مسبقًا في السلة')
      return
    }

    cart.push({
      id: book.id,
      title: book.title,
      price: book.price,
      image: book.image,
    })

    localStorage.setItem('cart', JSON.stringify(cart))
    alert(`✅ تمت إضافة "${book.title}" إلى السلة`)
  }

  return (
    <section className="text-right" dir="rtl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#2E2A28]">
            📖 كتب عربية
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            مجموعة مختارة من أحدث الكتب العربية
          </p>
        </div>

        <Link
          href="/books?filter=arabic"
          className="inline-flex items-center gap-2 rounded-full border border-[#ead7de] bg-white px-4 py-2 text-sm font-bold text-[#C05370] transition hover:bg-[#fff7fa]"
        >
          عرض الكل
          <span>←</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <ArabicBookCardSkeleton key={index} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm md:text-base text-gray-500">
          لا يوجد كتب عربية حالياً
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <ArabicBookCard
              key={book.id}
              book={book}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </section>
  )
}