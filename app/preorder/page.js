'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FiSend, FiCheckCircle } from 'react-icons/fi'

export default function PreOrderPage() {
  const [user, setUser] = useState(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [details, setDetails] = useState('')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // تعبئة الاسم/الهاتف من البروفايل إذا موجود
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setName(profile.full_name || '')
          setPhone(profile.phone || '')
        }
      }
    }

    fetchUser()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim() || !phone.trim() || !itemName.trim()) {
      setError('يرجى تعبئة الاسم ورقم الهاتف واسم الكتاب.')
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    // ✅ كتاب فقط + نوضح أنه Original
    const { error: insertError } = await supabase.from('preorders').insert([
      {
        user_id: user?.id || null,
        name: name.trim(),
        phone: phone.trim(),
        item_name: itemName.trim(),
        item_type: 'book_original', // ثابت (كتاب أصلي)
        quantity: Number(quantity || 1),
        details: details.trim() || null,
      },
    ])

    setLoading(false)

    if (insertError) {
      console.error(insertError)
      setError('حدث خطأ أثناء إرسال الطلب ❌')
      return
    }

    setSuccess('✅ تم إرسال طلب الكتاب الأصلي (Pre-Order) بنجاح!')
    setItemName('')
    setQuantity(1)
    setDetails('')
  }

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
      <div className="max-w-3xl mx-auto px-4 py-10 text-right">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28] mb-2">
          📦 طلب كتاب أصلي (Pre-Order)
        </h1>
        <p className="text-sm text-gray-600 mb-2">
          هون الطلب المسبق <strong>للكتب الأصلية فقط</strong>. اكتب اسم الكتاب وإذا مو موجود بالموقع نحاول نوفره لك ✨
        </p>
        <p className="text-xs text-gray-500 mb-6">
          ✅ هذا الخيار مخصص للـ <strong>Original Books</strong> فقط.
        </p>

        {!user && (
          <div className="rounded-3xl border bg-yellow-50 border-yellow-200 p-4 text-sm text-yellow-800 mb-5">
            ملاحظة: الأفضل تسجّل دخول لحتى تقدر تشوف طلبات الـ Pre-Order بحسابك.
            <Link href="/account/login" className="mr-2 underline font-bold text-[#C05370]">
              تسجيل الدخول
            </Link>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 inline-flex items-center gap-2">
            <FiCheckCircle /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium">الاسم الكامل</label>
              <input
                className="w-full border px-4 py-2.5 rounded-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">رقم الهاتف</label>
              <input
                className="w-full border px-4 py-2.5 rounded-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">اسم الكتاب المطلوب (أصلي)</label>
            <input
              className="w-full border px-4 py-2.5 rounded-full"
              placeholder="مثال: The Silent Patient / Fourth Wing ..."
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium">الكمية</label>
              <input
                type="number"
                min={1}
                className="w-full border px-4 py-2.5 rounded-full"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="rounded-2xl border bg-[#F4EDE4] px-4 py-3 text-xs text-gray-700 flex items-center">
              ✅ هذا الطلب للكتب الأصلية فقط
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">تفاصيل إضافية (اختياري)</label>
            <textarea
              className="w-full border px-4 py-3 rounded-2xl min-h-[110px]"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="لغة الكتاب، اسم الكاتب، ISBN إذا موجود، نسخة/طبعة..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#C05370] text-white px-6 py-3 rounded-full hover:opacity-90 transition disabled:opacity-60"
          >
            <FiSend /> {loading ? '...يتم الإرسال' : 'إرسال طلب الكتاب الأصلي'}
          </button>
        </form>
      </div>
    </section>
  )
}
