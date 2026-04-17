'use client'

import Link from 'next/link'
import Slider from './components/Slider'
import CategoriesGrid from './components/CategoriesGrid'
import NewBooks from './components/NewBooks'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import MobileSearchBar from './components/MobileSearchBar'
import WhyUs from './components/WhyUs'
import BannerOffer from './components/BannerOffer'
import LatestManga from './components/LatestManga'
import LatestSeries from './components/LatestSeries'
import HomeDiscountedBooks from './components/HomeDiscountedBooks'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const section = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function Section({ children }) {
  return (
    <motion.section
      variants={section}
      className="rounded-3xl bg-white/80 backdrop-blur border border-gray-100 shadow-md p-5 md:p-7 hover:shadow-lg transition"
    >
      {children}
    </motion.section>
  )
}

/* 🔥 سكشن عربي مطوّر */
function ArabicBooksSection() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const { data } = await supabase
      .from('books')
      .select('*')
      .eq('category', 'arabic')
      .order('created_at', { ascending: false })
      .limit(4)

    setBooks(data || [])
  }

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    localStorage.setItem('cart', JSON.stringify([...cart, book]))
    alert(`✅ تمت إضافة "${book.title}"`)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-[#2E2A28]">📖 كتب عربية</h2>

        <Link
          href="/books?filter=arabic"
          className="text-sm font-bold text-[#C05370] hover:underline"
        >
          عرض الكل
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center text-gray-500 py-8">لا يوجد كتب حالياً</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="rounded-3xl overflow-hidden bg-white shadow hover:shadow-xl transition"
            >
              <div className="relative h-52">
                <Image
                  src={book.image || '/fallback.jpg'}
                  alt={book.title}
                  fill
                  className="object-cover hover:scale-105 transition"
                />
              </div>

              <div className="p-4 space-y-2">
                <p className="font-bold text-sm line-clamp-2">{book.title}</p>

                <p className="text-[#C05370] font-extrabold">
                  {Number(book.price).toLocaleString()} ل.س
                </p>

                <button
                  onClick={() => addToCart(book)}
                  className="w-full bg-[#C05370] text-white py-2 rounded-full text-sm font-bold hover:opacity-90"
                >
                  🛒 إضافة للسلة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={container}
      className="min-h-screen text-right"
      dir="rtl"
    >
      <div className="bg-gradient-to-b from-[#FDF7F9] via-[#F4EDE4] to-[#F4F7F5]">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

          <motion.div variants={section}>
            <BannerOffer />
          </motion.div>

          {/* 🔥 Hero محسّن */}
          <motion.section
            variants={section}
            className="rounded-3xl bg-white shadow-md p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-extrabold text-[#2E2A28]">
                أهلاً في <span className="text-[#C05370]">Blooms</span> 📚
              </h1>
              <p className="text-gray-600 mt-2 text-sm">
                أفضل الكتب، المانجا، والعروض الحصرية ✨
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/books"
                className="px-6 py-2.5 rounded-full bg-[#C05370] text-white"
              >
                تصفّح الكتب
              </Link>

              <Link
                href="/offers"
                className="px-6 py-2.5 rounded-full border bg-white"
              >
                العروض
              </Link>
            </div>
          </motion.section>

          <motion.div variants={section}>
            <MobileSearchBar />
          </motion.div>

          <Section>
            <Slider />
          </Section>

          <Section>
            <NewBooks />
          </Section>

          <Section>
            <LatestSeries />
          </Section>

          

          <Section>
            <ArabicBooksSection />
          </Section>

          <Section>
            <CategoriesGrid />
          </Section>

         

          <Section>
            <WhyUs />
          </Section>

          <div className="text-center text-xs text-gray-500 py-4">
            © {new Date().getFullYear()} Blooms Bookstore
          </div>
        </div>
      </div>
    </motion.main>
  )
}