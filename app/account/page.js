'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FiUser, FiMail, FiPhone, FiMapPin, FiPackage, FiLogIn } from 'react-icons/fi'

export default function AccountPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (!user) {
        setLoading(false)
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData || null)

      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setOrders(orderData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const badge = (status) => {
    const s = (status || 'قيد المعالجة').trim()
    if (s === 'تم التوصيل') {
      return (
        <span className="text-xs px-3 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
          ✅ تم التوصيل
        </span>
      )
    }
    return (
      <span className="text-xs px-3 py-1 rounded-full border bg-yellow-50 text-yellow-800 border-yellow-200">
        ⏳ قيد المعالجة
      </span>
    )
  }

  const ordersWithTotals = useMemo(() => {
    return (orders || []).map((o) => {
      const items = o.items || []
      const total = items.reduce((sum, it) => sum + Number(it.price || 0), 0)
      return { ...o, _total: total }
    })
  }, [orders])

  // ✅ حالات العرض
  if (loading) {
    return (
      <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
        <div className="max-w-4xl mx-auto px-4 py-10 text-right">
          <div className="rounded-3xl border bg-white/80 backdrop-blur p-8 animate-pulse h-40" />
          <div className="mt-4 rounded-3xl border bg-white/80 backdrop-blur p-8 animate-pulse h-72" />
        </div>
      </section>
    )
  }

  // ✅ إذا غير مسجل دخول
  if (!user) {
    return (
      <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <div className="rounded-3xl border bg-white/80 backdrop-blur p-10">
            <div className="text-3xl mb-3">🔐</div>
            <h1 className="text-2xl font-extrabold text-[#2E2A28]">لازم تسجل دخول</h1>
            <p className="text-gray-600 mt-2">
              لتشوف طلباتك ومعلومات حسابك، سجّل دخول أو أنشئ حساب.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/account/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#C05370] text-white hover:opacity-90 transition"
              >
                <FiLogIn /> تسجيل الدخول
              </Link>
              <Link
                href="/account/register"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#4C7A68] text-[#4C7A68] font-extrabold hover:bg-[#4C7A68] hover:text-white transition"
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
      <div className="max-w-4xl mx-auto px-4 py-10 text-right">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28] mb-6">
          👤 حسابي
        </h1>

        {/* بطاقة معلومات الحساب */}
        <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#2E2A28] flex items-center gap-2">
              <FiUser className="text-[#C05370]" /> معلومات الحساب
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border bg-gray-50 p-4">
              <div className="text-gray-600 flex items-center gap-2">
                <FiMail /> البريد
              </div>
              <div className="font-bold text-[#2E2A28] mt-1">{user.email}</div>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-4">
              <div className="text-gray-600 flex items-center gap-2">
                <FiUser /> الاسم
              </div>
              <div className="font-bold text-[#2E2A28] mt-1">{profile?.full_name || 'غير متوفر'}</div>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-4">
              <div className="text-gray-600 flex items-center gap-2">
                <FiPhone /> الهاتف
              </div>
              <div className="font-bold text-[#2E2A28] mt-1">{profile?.phone || 'غير متوفر'}</div>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-4">
              <div className="text-gray-600 flex items-center gap-2">
                <FiMapPin /> العنوان
              </div>
              <div className="font-bold text-[#2E2A28] mt-1">
                {profile?.location_type || 'غير محدد'} — {profile?.location_details || '---'}
              </div>
            </div>
          </div>
        </div>

        {/* الطلبات */}
        <div className="mt-8">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-extrabold text-[#2E2A28] flex items-center gap-2">
              <FiPackage className="text-[#C05370]" /> طلباتي
            </h2>

            <span className="text-sm text-gray-600">
              عدد الطلبات: <span className="font-bold">{ordersWithTotals.length}</span>
            </span>
          </div>

          {ordersWithTotals.length === 0 ? (
            <div className="rounded-3xl border bg-white/80 backdrop-blur p-8 text-center text-gray-700">
              لا يوجد طلبات بعد.
              <div className="mt-4">
                <Link
                  href="/books"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#4C7A68] text-white hover:opacity-90 transition"
                >
                  تصفح الكتب
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersWithTotals.map((order) => (
                <div key={order.id} className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm overflow-hidden">
                  <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-extrabold text-[#2E2A28]">
                          طلب بتاريخ: {new Date(order.created_at).toLocaleDateString('ar-SY')}
                        </div>
                        {badge(order.status)}
                      </div>

                      <div className="text-sm text-gray-600 mt-1">
                        📍 {order.location_type === 'damascus'
                          ? `دمشق - ${order.area || 'غير محدد'}`
                          : `${order.province || 'غير محدد'} - فرع القدموس: ${order.kadmous_branch || 'غير محدد'}`}
                      </div>

                      <div className="text-sm text-gray-600 mt-1">
                        📝 ملاحظات: {order.note || 'لا يوجد'}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-600">عدد العناصر</div>
                      <div className="text-lg font-extrabold text-[#C05370]">
                        {order.items?.length || 0}
                      </div>

                      <div className="text-sm text-gray-600 mt-2">المجموع</div>
                      <div className="text-lg font-extrabold text-[#4C7A68]">
                        {Number(order._total || 0).toLocaleString()} ل.س
                      </div>
                    </div>
                  </div>

                  <div className="border-t bg-white p-5 md:p-6">
                    <div className="font-bold text-gray-800 mb-2">📚 العناصر</div>
                    <ul className="space-y-2 text-sm">
                      {order.items?.map((item, i) => (
                        <li key={i} className="rounded-2xl border p-3 flex items-center justify-between gap-3">
                          <span className="font-semibold text-gray-800">{item.title}</span>
                          <span className="font-bold text-[#4C7A68]">
                            {Number(item.price || 0).toLocaleString()} ل.س
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
