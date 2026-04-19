'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

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
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#2E2A28]">
        {title}
      </h2>

      <Link
        href={link}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#C05370] transition hover:text-[#a84460]"
      >
        عرض الكل
        <span>←</span>
      </Link>
    </div>
  )
}

function BookCard({ book, onAdd }) {
  const imageSrc =
    book.image?.startsWith('http') || book.image?.startsWith('/')
      ? book.image
      : '/fallback.jpg'

  return (
    <div className="group h-full overflow-hidden rounded-[24px] border border-[#f1e8eb] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-b from-[#fffafb] to-[#f7f7f7]">
        <Image
          src={imageSrc}
          alt={book.title}
          fill
          className="object-contain p-3 md:p-4 transition duration-300 group-hover:scale-105"
        />

        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#4C7A68] shadow-sm">
          متوفر
        </div>
      </div>

      <div className="space-y-3 p-4 text-right">
        <h3 className="min-h-[48px] text-sm md:text-base font-extrabold leading-6 text-[#2E2A28] line-clamp-2">
          {book.title}
        </h3>

        <p className="text-sm md:text-lg font-extrabold text-[#C05370]">
          {Number(book.price || 0).toLocaleString()} ل.س
        </p>

        <button
          onClick={() => onAdd(book)}
          className="w-full rounded-full bg-[#4C7A68] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#3f6757] active:scale-[0.98]"
        >
          🛒 إضافة إلى السلة
        </button>
      </div>
    </div>
  )
}

function BookCardSkeleton() {
  return (
    <div className="rounded-[24px] border bg-white p-3 shadow-sm animate-pulse">
      <div className="mb-4 h-44 sm:h-56 md:h-64 rounded-2xl bg-gray-100" />
      <div className="mb-2 h-4 rounded bg-gray-100" />
      <div className="mb-4 h-4 w-2/3 rounded bg-gray-100" />
      <div className="h-10 rounded-full bg-gray-100" />
    </div>
  )
}

function BooksGrid({ title, link, books, loading, onAdd }) {
  return (
    <div>
      <SectionHeader title={title} link={link} />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-10 text-center text-sm md:text-base text-gray-500">
          لا يوجد كتب حالياً
        </div>
      ) : (
        <>
          {/* موبايل: سلايدر كتابين */}
          <div className="md:hidden">
            <Swiper
              spaceBetween={12}
              slidesPerView={2}
              loop={books.length > 2}
              autoplay={{
                delay: 2800,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              className="pb-2"
            >
              {books.map((book) => (
                <SwiperSlide key={book.id} className="h-auto">
                  <BookCard book={book} onAdd={onAdd} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ديسكتوب وتابلت: Grid */}
          <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onAdd={onAdd} />
            ))}
          </div>
        </>
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
        .limit(6)

      if (error) {
        console.error(`فشل في جلب الكتب للقسم ${filter}:`, error.message)
        setBooks([])
      } else {
        setBooks(data || [])
      }

      setLoading(false)
    }

    fetchBooks()
  }, [filter])

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
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:space-y-8 md:px-6 md:py-8">
          <motion.div variants={section}>
            <BannerOffer />
          </motion.div>

          <motion.section
            variants={section}
            className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.07)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#C05370]/10 via-transparent to-[#4C7A68]/10" />

            <div className="relative flex flex-col items-start justify-between gap-6 px-6 py-8 md:flex-row md:items-center md:px-10 md:py-12">
              <div className="max-w-2xl space-y-3">
                <span className="inline-block rounded-full bg-[#C05370]/10 px-4 py-1.5 text-sm font-bold text-[#C05370]">
                  متجر كتبك المفضل
                </span>

                <h1 className="text-3xl md:text-5xl font-black leading-tight text-[#2E2A28]">
                  أهلاً في <span className="text-[#C05370]">Blooms</span> 📚
                </h1>

                <p className="text-sm md:text-base leading-7 text-gray-600">
                  اكتشف أحدث الكتب، أفضل السلاسل، والمانغا المميزة ضمن تجربة
                  أنيقة وسريعة وسهلة.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/books"
                    className="rounded-full bg-[#C05370] px-6 py-3 text-sm md:text-base font-bold text-white shadow-sm transition hover:bg-[#aa4862]"
                  >
                    تصفّح الكتب
                  </Link>

                  <Link
                    href="/categories"
                    className="rounded-full border border-[#d9c6cd] bg-white px-6 py-3 text-sm md:text-base font-bold text-[#2E2A28] transition hover:bg-[#faf7f8]"
                  >
                    استكشف التصنيفات
                  </Link>
                </div>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <div className="rounded-3xl border border-[#f1dce3] bg-[#fff7fa] px-5 py-4 shadow-sm">
                  <p className="mb-1 text-xs text-gray-500">تجربة قراءة</p>
                  <p className="font-extrabold text-[#2E2A28]">أجمل وأكثر هدوءاً</p>
                </div>

                <div className="rounded-3xl border border-[#d8ebe2] bg-[#f4faf7] px-5 py-4 shadow-sm">
                  <p className="mb-1 text-xs text-gray-500">عروض مستمرة</p>
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