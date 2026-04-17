'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export default function ArabicBooksSection() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetchArabicBooks()
  }, [])

  const fetchArabicBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('category', 'arabic')
      .order('created_at', { ascending: false })
      .limit(4)

    if (!error) setBooks(data || [])
  }

  // ✅ إضافة للسلة
  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    localStorage.setItem('cart', JSON.stringify([...cart, book]))
    alert(`✅ تمت إضافة "${book.title}" إلى السلة`)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28]">
          📖 كتب عربية
        </h2>

        <Link
          href="/books?filter=arabic"
          className="text-sm text-[#C05370] font-bold hover:underline"
        >
          عرض الكل
        </Link>
      </div>

      {/* Content */}
      {books.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
          لا يوجد كتب عربية حالياً
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="group rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition duration-300 border"
            >
              {/* Image */}
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={book.image || '/fallback.jpg'}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <p className="font-extrabold text-base text-[#2E2A28] line-clamp-2">
                  {book.title}
                </p>

                <p className="text-[#C05370] text-lg font-extrabold">
                  {Number(book.price || 0).toLocaleString()} ل.س
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  
                  <Link
                    href={`/books/${book.id}`}
                    className="text-center text-sm border rounded-full py-2 hover:bg-gray-50 transition"
                  >
                    عرض التفاصيل
                  </Link>

                  <button
                    onClick={() => addToCart(book)}
                    className="text-center text-sm font-bold text-white bg-[#C05370] py-2.5 rounded-full hover:opacity-90 transition"
                  >
                    🛒 إضافة للسلة
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}