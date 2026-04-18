'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import Slider from './components/Slider'
import CategoriesGrid from './components/CategoriesGrid'
import NewBooks from './components/NewBooks'
import MobileSearchBar from './components/MobileSearchBar'
import WhyUs from './components/WhyUs'
import BannerOffer from './components/BannerOffer'
import LatestManga from './components/LatestManga'
import LatestSeries from './components/LatestSeries'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const section = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
}

function Section({ children, className = '' }) {
  return (
    <motion.section
      variants={section}
      className={`rounded-[28px] border border-white/60 bg-white/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-5 md:p-7 ${className}`}
    >
      {children}
    </motion.section>
  )
}

function SectionHeader({ title, link }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#2E2A28]">
        {title}
      </h2>

      <Link
        href={link}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#C05370] hover:text-[#a84460] transition"
      >
        عرض الكل
        <span>←</span>
      </Link>
    </div>
  )
}

function BookCard({ book, onAdd }) {
  return (
    <div className="group overflow-hidden rounded-[24px] border border-[#f1e8eb] bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
      <div className="relative h-56 md:h-64 bg-gradient-to-b from-[#fffafb] to-[#f7f7f7] overflow-hidden">
        <Image
          src={book.image || '/fallback.jpg'}
          alt={book.title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition duration-300"
        />

        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#4C7A68] shadow-sm">
          متوفر
        </div>
      </div>

      <div className="p-4 text-right space-y-3">
        <h3 className="text-sm md:text-base font-extrabold text-[#2E2A28] line-clamp-2 leading-6 min-h-[48px]">
          {book.title}
        </h3>

        <div className="flex items-center justify-between gap-3">
          <p className="text-[#C05370] font-extrabold text-base md:text-lg">
            {Number(book.price || 0).toLocaleString()} ل.س
          </p>
        </div>

        <button
          onClick={() => onAdd(book)}
          className="w-full rounded-full bg-[#4C7A68] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#3f6757] active:scale-[0.98] transition"
        >
          🛒 إضافة إلى السلة
        </button>
      </div>
    </div>
  )
}

function BooksGrid({ title, link, books, loading, onAdd }) {
  return (
    <div>
      <SectionHeader title={title} link={link} />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-[24px] border bg-white p-3 shadow-sm animate-pulse"
            >
              <div className="h-56 md:h-64 rounded-2xl bg-gray-100 mb-4" />
              <div className="h-4 bg-gray-100 rounded mb-2" />
              <div className="h-4 bg-gray-100 rounded w-2/3 mb-4" />
              <div className="h-10 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-10 text-center text-sm md:text-base text-gray-500">
          لا يوجد كتب حالياً
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onAdd={onAdd} />
          ))}
        </div>
      )}
    </div>
  )
}

function PublisherBooksSection({ title, filter, link }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('category', filter)
        .order('created_at', { ascending: false })
        .limit(4)

      if (!error) {
        setBooks(data || [])
      }

      setLoading(false)
    }

    fetchBooks()
  }, [filter])

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    localStorage.setItem('cart', JSON.stringify([...cart, book]))
    alert(`✅ تمت إضافة "${book.title}" إلى السلة`)
  }

  return (
    <BooksGrid
      title={title}
      link={link}
      books={books}
      loading={loading}
      onAdd={addToCart}
    />
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
      <div className="bg-[radial-gradient(circle_at_top,_#fff7fa,_#f5ede4_45%,_#f4f7f5_100%)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
          <motion.div variants={section}>
            <BannerOffer />
          </motion.div>

          <motion.section
            variants={section}
            className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.07)]"
          >
            <div className="absolute inset-0 bg-gradient-to-l from-[#C05370]/10 via-transparent to-[#4C7A68]/10 pointer-events-none" />

            <div className="relative px-6 py-8 md:px-10 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <span className="inline-block rounded-full bg-[#C05370]/10 px-4 py-1.5 text-sm font-bold text-[#C05370]">
                  متجر كتبك المفضل
                </span>

                <h1 className="text-3xl md:text-5xl font-black leading-tight text-[#2E2A28]">
                  أهلاً في <span className="text-[#C05370]">Blooms</span> 📚
                </h1>

                <p className="text-sm md:text-base text-gray-600 leading-7">
                  اكتشف أحدث الكتب، أفضل السلاسل، والمانغا المميزة ضمن تجربة
                  أنيقة وسريعة وسهلة.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/books"
                    className="rounded-full bg-[#C05370] px-6 py-3 text-sm md:text-base font-bold text-white hover:bg-[#aa4862] transition shadow-sm"
                  >
                    تصفّح الكتب
                  </Link>

                  <Link
                    href="/categories"
                    className="rounded-full border border-[#d9c6cd] bg-white px-6 py-3 text-sm md:text-base font-bold text-[#2E2A28] hover:bg-[#faf7f8] transition"
                  >
                    استكشف التصنيفات
                  </Link>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <div className="rounded-3xl bg-[#fff7fa] px-5 py-4 shadow-sm border border-[#f1dce3]">
                  <p className="text-xs text-gray-500 mb-1">تجربة قراءة</p>
                  <p className="font-extrabold text-[#2E2A28]">أجمل وأكثر هدوءاً</p>
                </div>

                <div className="rounded-3xl bg-[#f4faf7] px-5 py-4 shadow-sm border border-[#d8ebe2]">
                  <p className="text-xs text-gray-500 mb-1">عروض مستمرة</p>
                  <p className="font-extrabold text-[#2E2A28]">على كتب مختارة</p>
                </div>
              </div>
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
            <PublisherBooksSection
              title="📚 دار عصير الكتب"
              filter="aseer"
              link="/books?filter=aseer"
            />
          </Section>

          <Section>
            <PublisherBooksSection
              title="📚 دار الرافدين"
              filter="rafedain"
              link="/books?filter=rafedain"
            />
          </Section>

          <Section>
            <CategoriesGrid />
          </Section>

          <Section>
            <LatestManga />
          </Section>

          <Section>
            <WhyUs />
          </Section>

          <div className="pt-2 pb-6 text-center text-xs md:text-sm text-gray-500">
            © {new Date().getFullYear()} Blooms Bookstore — جميع الحقوق محفوظة
          </div>
        </div>
      </div>
    </motion.main>
  )
}