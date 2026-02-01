'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FiRefreshCw, FiTrash2, FiCheck, FiClock, FiX, FiPhone, FiUser, FiBook } from 'react-icons/fi'

const badge = (status) => {
  const s = (status || 'قيد المراجعة').trim()

  if (s === 'تم التأكيد') {
    return 'bg-green-50 text-green-700 border-green-200'
  }
  if (s === 'غير متوفر') {
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }
  return 'bg-yellow-50 text-yellow-800 border-yellow-200'
}

export default function PreOrdersDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  // filters
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all | pending | confirmed | unavailable

  const fetchAll = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('preorders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('فشل في جلب preorders:', error)
      setItems([])
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()

    return (items || []).filter((x) => {
      const match =
        !qq ||
        (x.name || '').toLowerCase().includes(qq) ||
        (x.phone || '').toLowerCase().includes(qq) ||
        (x.item_name || '').toLowerCase().includes(qq)

      let okStatus = true
      const s = (x.status || 'قيد المراجعة').trim()

      if (statusFilter === 'pending') okStatus = s === 'قيد المراجعة'
      if (statusFilter === 'confirmed') okStatus = s === 'تم التأكيد'
      if (statusFilter === 'unavailable') okStatus = s === 'غير متوفر'

      return match && okStatus
    })
  }, [items, q, statusFilter])

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('preorders').update({ status }).eq('id', id)
    if (error) {
      console.error(error)
      alert('❌ حدث خطأ أثناء تحديث الحالة')
      return
    }
    fetchAll()
  }

  const remove = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return
    const { error } = await supabase.from('preorders').delete().eq('id', id)
    if (error) {
      console.error(error)
      alert('❌ حدث خطأ أثناء الحذف')
      return
    }
    fetchAll()
  }

  const exportCSV = () => {
    const headers = ['الاسم', 'الهاتف', 'اسم الكتاب', 'الكمية', 'التفاصيل', 'الحالة', 'التاريخ']
    const rows = filtered.map((x) => [
      x.name || '',
      x.phone || '',
      x.item_name || '',
      x.quantity || 1,
      (x.details || '').replace(/\n/g, ' '),
      x.status || 'قيد المراجعة',
      x.created_at ? new Date(x.created_at).toLocaleString('ar-EG') : '',
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const bom = '\uFEFF'
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'preorders.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
      <div className="max-w-6xl mx-auto px-4 py-10 text-right">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28]">
              📦 طلبات Pre-Order (كتب أصلية)
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              كل طلبات الكتب الأصلية المطلوبة من الزبائن + معلومات التواصل
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={fetchAll}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#4C7A68] text-white hover:opacity-90 transition"
            >
              <FiRefreshCw /> تحديث
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#D9A441] text-white hover:opacity-90 transition"
            >
              📥 تصدير CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <input
              className="md:col-span-2 w-full border px-4 py-2.5 rounded-full"
              placeholder="ابحث بالاسم / الهاتف / اسم الكتاب..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <select
              className="w-full border px-4 py-2.5 rounded-full bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">كل الحالات</option>
              <option value="pending">قيد المراجعة</option>
              <option value="confirmed">تم التأكيد</option>
              <option value="unavailable">غير متوفر</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">...جارٍ تحميل الطلبات</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border bg-white/80 backdrop-blur p-8 text-center text-gray-700">
            لا يوجد طلبات Pre-Order حالياً.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((x) => {
              const st = (x.status || 'قيد المراجعة').trim()
              return (
                <div key={x.id} className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-extrabold text-[#2E2A28] inline-flex items-center gap-2">
                          <FiBook className="text-[#C05370]" />
                          {x.item_name}
                        </div>

                        <span className={`text-xs px-3 py-1 rounded-full border ${badge(st)}`}>
                          {st}
                        </span>
                      </div>

                      <div className="text-sm text-gray-700 mt-2 flex flex-wrap gap-x-6 gap-y-2">
                        <span className="inline-flex items-center gap-2">
                          <FiUser /> {x.name}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <FiPhone /> {x.phone}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          📦 الكمية: <strong>{x.quantity || 1}</strong>
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 mt-2">
                        🕒 {x.created_at ? new Date(x.created_at).toLocaleString('ar-EG') : '---'}
                      </div>

                      {x.details && (
                        <div className="mt-3 rounded-2xl border bg-white p-3 text-sm text-gray-700 whitespace-pre-line">
                          📝 {x.details}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateStatus(x.id, 'قيد المراجعة')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm hover:bg-gray-50"
                      >
                        <FiClock /> قيد المراجعة
                      </button>
                      <button
                        onClick={() => updateStatus(x.id, 'تم التأكيد')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4C7A68] text-white text-sm hover:opacity-90"
                      >
                        <FiCheck /> تم التأكيد
                      </button>
                      <button
                        onClick={() => updateStatus(x.id, 'غير متوفر')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 text-white text-sm hover:opacity-90"
                      >
                        <FiX /> غير متوفر
                      </button>
                      <button
                        onClick={() => remove(x.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 text-red-600 text-sm hover:bg-red-50"
                      >
                        <FiTrash2 /> حذف
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
