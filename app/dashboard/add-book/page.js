'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuid } from 'uuid'
import Image from 'next/image'
import { FiTrash2, FiSave, FiImage } from 'react-icons/fi'

export default function AddBookPage() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('english')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [books, setBooks] = useState([])
  const [updatedPrices, setUpdatedPrices] = useState({})
  const [query, setQuery] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const previewUrl = useMemo(() => {
    if (!imageFile) return ''
    return URL.createObjectURL(imageFile)
  }, [imageFile])

  useEffect(() => {
    fetchBooks()
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [])

  const fetchBooks = async () => {
    const { data } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })

    setBooks(data || [])
  }

  const filteredBooks = useMemo(() => {
    const q = query.toLowerCase()
    return books.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q)
    )
  }, [books, query])

  const resetForm = () => {
    setTitle('')
    setCategory('english')
    setDescription('')
    setPrice('')
    setImageFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let imageUrl = ''

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}_${uuid()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('book-images')
          .upload(`books/${fileName}`, imageFile)

        if (uploadError) throw uploadError

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/book-images/books/${fileName}`
      }

      const { error } = await supabase.from('books').insert([
        {
          title,
          category,
          description,
          price: Number(price),
          image: imageUrl,
        },
      ])

      if (error) throw error

      setSuccess('✅ تم إضافة الكتاب')
      resetForm()
      fetchBooks()
    } catch (err) {
      console.error(err)
      setError('❌ صار خطأ أثناء الإضافة')
    }

    setLoading(false)
  }

  const handleUpdatePrice = async (id) => {
    const newPrice = updatedPrices[id]
    if (!newPrice) return

    const { error } = await supabase
      .from('books')
      .update({ price: Number(newPrice) })
      .eq('id', id)

    if (error) {
      console.error(error)
      setError('❌ فشل تحديث السعر')
    } else {
      setSuccess('✅ تم تحديث السعر')
      fetchBooks()
    }
  }

  const handleDelete = async (id) => {
    const ok = confirm('هل أنت متأكد؟')
    if (!ok) return

    const { error } = await supabase.from('books').delete().eq('id', id)

    if (error) {
      console.error(error)
      setError('❌ فشل الحذف')
    } else {
      setSuccess('✅ تم الحذف')
      fetchBooks()
    }
  }

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#FDF7F9] to-[#F4F7F5]">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        <h1 className="text-3xl font-extrabold">📘 إضافة كتاب</h1>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 p-3 rounded-xl">{success}</div>}

        {/* ✅ الفورم بعد الإصلاح */}
        <div className="bg-white p-6 rounded-3xl shadow space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              placeholder="عنوان الكتاب"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-3 rounded-full"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border px-4 py-3 rounded-full"
              >
                <option value="english">إنجليزي</option>
                <option value="arabic">عربي</option>
                <option value="kids">أطفال</option>
                <option value="original">أصلي</option>
              </select>

              <input
                type="number"
                placeholder="السعر"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border px-4 py-3 rounded-full"
                required
              />
            </div>

            <textarea
              placeholder="وصف"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-4 py-3 rounded-2xl"
            />

            {/* صورة */}
            <div className="grid md:grid-cols-2 gap-4">
              <label className="border p-4 rounded-2xl text-center cursor-pointer">
                <FiImage className="mx-auto mb-2" />
                اختر صورة
                <input
                  type="file"
                  hidden
                  onChange={(e) => setImageFile(e.target.files?.[0])}
                />
              </label>

              <div className="border rounded-2xl h-40 flex items-center justify-center bg-gray-50">
                {previewUrl ? (
                  <Image src={previewUrl} alt="preview" width={150} height={150} />
                ) : (
                  <span className="text-gray-400">معاينة</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C05370] text-white py-3 rounded-full disabled:opacity-60"
            >
              {loading ? 'جاري الإضافة...' : '➕ إضافة كتاب'}
            </button>

          </form>
        </div>

        {/* List */}
        <div className="bg-white p-6 rounded-3xl shadow">

          <input
            placeholder="بحث..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border px-3 py-2 rounded-full mb-4 w-full"
          />

          <div className="space-y-3">
            {filteredBooks.map((book) => (
              <div key={book.id} className="flex justify-between items-center border p-3 rounded-xl">

                <div className="flex gap-3 items-center">
                  <Image src={book.image || '/fallback.jpg'} width={50} height={50} alt="" />
                  <div>
                    <p className="font-bold">{book.title}</p>
                    <p className="text-sm text-gray-500">{book.category}</p>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={updatedPrices[book.id] ?? book.price}
                    onChange={(e) =>
                      setUpdatedPrices({ ...updatedPrices, [book.id]: e.target.value })
                    }
                    className="w-20 border px-2 py-1 rounded-full"
                  />

                  <button onClick={() => handleUpdatePrice(book.id)}>
                    <FiSave />
                  </button>

                  <button onClick={() => handleDelete(book.id)}>
                    <FiTrash2 />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}