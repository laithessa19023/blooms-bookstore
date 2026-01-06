'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { FiPercent, FiSearch, FiShoppingCart } from 'react-icons/fi'

export default function OffersPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchDiscountedBooks = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_discounted', true)
        .order('created_at', { ascending: false })

      if (!error) setBooks(data || [])
      setLoading(false)
    }

    fetchDiscountedBooks()
  }, [])

  const handleAddToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const exists = cart.find((b) => b.id === book.id)

    if (!exists) {
      cart.push({
        id: book.id,
        title: book.title,
        price: book.discount_price || book.price,
        image: book.image,
      })
      localStorage.setItem('cart', JSON.stringify(cart))
      alert('✅ تم إضافة الكتاب للسلة!')
    } else {
      alert('📚 هذا الكتاب موجود مسبقًا في السلة.')
    }
  }

  const discountPercent = (price, discountPrice) => {
    const p = Number(price || 0)
    const d = Number(discountPrice || 0)
    if (!p || !d || d >= p) return null
    return Math.round(((p - d) / p) * 100)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return books
    return (books || []).filter((b) => (b.title || '').toLowerCase().includes(q))
  }, [books, query])

  const BookCard = ({ book }) => {
    const img =
      book.image?.startsWith('http') || book.image?.startsWith('/')
        ? book.image
        : '/placeholder.jpg'

    const oldPrice = Number(book.price || 0)
    const newPrice = Number(book.discount_price || 0)
    const pct = discountPercent(oldPrice, newPrice)

    return (
      <div className="group rounded-3xl border bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition overflow-hidden flex flex-col relative">
        {/* Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-2 text-[11px] px-3 py-1 rounded-full bg-white/90 border border-white/60 text-[#C05370] font-extrabold">
            <FiPercent />
            {pct ? `خصم ${pct}%` : 'خصم'}
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

          <div className="p-4 space-y-2 text-center">
            <h3 className="text-sm sm:text-base font-extrabold text-[#2E2A28] line-clamp-2">
              {book.title}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {book.description || 'وصف غير متوفر حالياً.'}
            </p>

            <div className="flex items-baseline justify-center gap-3">
              <span className="text-sm font-extrabold text-[#C05370]">
                {newPrice ? `${newPrice.toLocaleString()} ل.س` : 'السعر غير متوفر'}
              </span>

              {oldPrice ? (
                <span className="text-xs text-gray-400 line-through">
                  {oldPrice.toLocaleString()} ل.س
                </span>
              ) : null}
            </div>
          </div>
        </Link>

        <div className="p-4 pt-0 mt-auto">
          <button
            onClick={() => handleAddToCart(book)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C05370] text-white text-sm py-2.5 hover:opacity-90 transition"
          >
            <FiShoppingCart /> أضف إلى السلة
          </button>
        </div>
      </div>
    )
  }

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 text-right">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28]">
            🔥 عروض خاصة على الكتب
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            أسعار مخفّضة لفترة محدودة — سارع قبل نفاد الكميات
          </p>
        </div>

        {/* Search */}
        <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-4 md:p-5 mb-6">
          <div className="relative">
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث ضمن العروض باسم الكتاب..."
              className="w-full pr-11 pl-4 py-2.5 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
            />
          </div>

          {!loading && (
            <div className="mt-3 text-sm text-gray-600">
              عدد النتائج: <span className="font-bold">{filtered.length}</span>
            </div>
          )}
        </div>

        {/* حالات العرض */}
        {loading ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl border bg-white/70 h-[420px] animate-pulse" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-3xl border bg-white/80 backdrop-blur p-10 text-center">
            <h2 className="text-xl font-extrabold text-[#2E2A28]">ما في عروض حالياً</h2>
            <p className="text-gray-600 mt-2">تابعنا لتشوف الجديد 👌</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/books"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#4C7A68] text-white hover:opacity-90 transition"
              >
                تصفح كل الكتب
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#C05370] text-[#C05370] font-extrabold hover:bg-[#C05370] hover:text-white transition"
              >
                العودة للرئيسية
              </Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border bg-white/80 backdrop-blur p-10 text-center text-gray-700">
            لا توجد نتائج مطابقة لبحثك.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
