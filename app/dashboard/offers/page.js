'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FiSearch, FiPercent, FiSave, FiRefreshCw } from 'react-icons/fi'

export default function ManageOffersPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)

  const [query, setQuery] = useState('')
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false)

  const fetchBooks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('books')
      .select('id, title, price, is_discounted, discount_price, created_at')
      .order('created_at', { ascending: false })

    if (!error) setBooks(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleUpdate = async (book) => {
    // ✅ تحققات بسيطة
    const original = Number(book.price || 0)
    const discount = Number(book.discount_price || 0)

    if (book.is_discounted) {
      if (!discount || discount <= 0) return alert('يرجى إدخال سعر عرض صحيح')
      if (original && discount >= original) return alert('سعر العرض يجب أن يكون أقل من السعر الأصلي')
    }

    setSavingId(book.id)
    const { error } = await supabase
      .from('books')
      .update({
        is_discounted: !!book.is_discounted,
        discount_price: book.is_discounted ? discount : null,
      })
      .eq('id', book.id)

    setSavingId(null)

    if (!error) {
      alert('✅ تم التحديث بنجاح')
      fetchBooks()
    } else {
      console.error(error)
      alert('❌ حدث خطأ أثناء التحديث')
    }
  }

  const handleChange = (id, field, value) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id !== id) return book

        // إذا طفى الخصم نمسح سعر الخصم
        if (field === 'is_discounted' && value === false) {
          return { ...book, is_discounted: false, discount_price: null }
        }

        return { ...book, [field]: value }
      })
    )
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (books || []).filter((b) => {
      const matchQuery = !q || (b.title || '').toLowerCase().includes(q)
      const matchDiscounted = !showOnlyDiscounted || !!b.is_discounted
      return matchQuery && matchDiscounted
    })
  }, [books, query, showOnlyDiscounted])

  const discountPercent = (price, discountPrice) => {
    const p = Number(price || 0)
    const d = Number(discountPrice || 0)
    if (!p || !d || d >= p) return null
    return Math.round(((p - d) / p) * 100)
  }

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 text-right">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28]">
              🎯 إدارة العروض
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              فعّل/ألغِ الخصم وحدد سعر العرض لكل كتاب
            </p>
          </div>

          <button
            onClick={fetchBooks}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#4C7A68] text-white hover:opacity-90 transition"
          >
            <FiRefreshCw /> تحديث القائمة
          </button>
        </div>

        {/* أدوات البحث والفلترة */}
        <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-4 md:p-5 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-2 relative">
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث باسم الكتاب..."
                className="w-full pr-11 pl-4 py-2.5 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
              <input
                type="checkbox"
                checked={showOnlyDiscounted}
                onChange={(e) => setShowOnlyDiscounted(e.target.checked)}
              />
              عرض الكتب المخفّضة فقط
            </label>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            عدد النتائج: <span className="font-bold">{filtered.length}</span>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">...جارٍ تحميل الكتب</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border bg-white/80 backdrop-blur p-8 text-center text-gray-700">
            لا توجد نتائج مطابقة.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((book) => {
              const pct = discountPercent(book.price, book.discount_price)

              return (
                <div
                  key={book.id}
                  className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-4 md:p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-extrabold text-[#2E2A28] line-clamp-2">
                        {book.title}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        السعر الأصلي:{' '}
                        <span className="font-bold text-[#4C7A68]">
                          {Number(book.price || 0).toLocaleString()} ل.س
                        </span>
                        {pct ? (
                          <span className="mr-2 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-red-50 text-red-700 border-red-200">
                            <FiPercent /> خصم {pct}%
                          </span>
                        ) : null}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="text-sm flex items-center gap-2 bg-gray-50 border rounded-full px-4 py-2">
                        <input
                          type="checkbox"
                          checked={!!book.is_discounted}
                          onChange={(e) =>
                            handleChange(book.id, 'is_discounted', e.target.checked)
                          }
                        />
                        تفعيل خصم
                      </label>

                      <input
                        type="number"
                        min={0}
                        className="border px-4 py-2 rounded-full text-sm w-44 focus:outline-none focus:ring-2 focus:ring-[#C05370]/30"
                        placeholder="سعر العرض"
                        value={book.discount_price ?? ''}
                        onChange={(e) =>
                          handleChange(
                            book.id,
                            'discount_price',
                            e.target.value === '' ? null : Number(e.target.value)
                          )
                        }
                        disabled={!book.is_discounted}
                      />

                      <button
                        onClick={() => handleUpdate(book)}
                        disabled={savingId === book.id}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#C05370] text-white hover:opacity-90 transition disabled:opacity-60"
                      >
                        <FiSave />
                        {savingId === book.id ? '...جارٍ الحفظ' : 'حفظ'}
                      </button>
                    </div>
                  </div>

                  {/* ملاحظة صغيرة */}
                  {book.is_discounted && (
                    <p className="text-xs text-gray-500 mt-3">
                      ملاحظة: سعر العرض يجب أن يكون أقل من السعر الأصلي.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
