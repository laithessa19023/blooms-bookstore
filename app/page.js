'use client'

import Link from 'next/link'
import Slider from './components/Slider'
import CategoriesGrid from './components/CategoriesGrid'
import NewBooks from './components/NewBooks'
import { motion } from 'framer-motion'
import { useState } from 'react'
import MobileSearchBar from './components/MobileSearchBar'
import WhyUs from './components/WhyUs'
import BannerOffer from './components/BannerOffer'
import RequestBook from './components/RequestBook'
import LatestManga from './components/LatestManga'
import LatestSeries from './components/LatestSeries'
import HomeDiscountedBooks from './components/HomeDiscountedBooks'
import { FiClipboard, FiPackage, FiClock } from 'react-icons/fi'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const section = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

function Section({ children }) {
  return (
    <motion.section
      variants={section}
      className="rounded-3xl bg-white/70 backdrop-blur border border-white/60 shadow-sm p-4 md:p-6"
    >
      {children}
    </motion.section>
  )
}

function PreOrderPromo() {
  return (
    <div className="rounded-3xl border bg-gradient-to-b from-white/90 to-white/70 backdrop-blur shadow-sm p-5 md:p-7">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#2E2A28]">
            📦 Pre-Order — اطلب أي شي مو موجود
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
            بدك كتاب/مانجا/بوكمارك/فيغرة وما لقيتها بالموقع؟ قدّم طلب مسبق ونحن منأمّنلك ياها ونرجع نتواصل معك.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <div className="rounded-2xl border bg-white/80 p-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#F4EDE4] flex items-center justify-center text-[#C05370]">
                <FiClipboard />
              </span>
              <div>
                <div className="font-bold text-[#2E2A28] text-sm">املأ الطلب بسرعة</div>
                <div className="text-xs text-gray-600">اسم + نوع + تفاصيل</div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white/80 p-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#F4EDE4] flex items-center justify-center text-[#4C7A68]">
                <FiPackage />
              </span>
              <div>
                <div className="font-bold text-[#2E2A28] text-sm">نأمّن المطلوب</div>
                <div className="text-xs text-gray-600">حسب التوفر والسعر</div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white/80 p-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#F4EDE4] flex items-center justify-center text-gray-700">
                <FiClock />
              </span>
              <div>
                <div className="font-bold text-[#2E2A28] text-sm">نتواصل معك</div>
                <div className="text-xs text-gray-600">لتأكيد التفاصيل</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Link
            href="/preorder"
            className="px-6 py-3 rounded-full bg-[#C05370] text-white font-bold hover:opacity-90 transition text-center"
          >
            🚀 قدّم Pre-Order
          </Link>
          <Link
            href="/offers"
            className="px-6 py-3 rounded-full border bg-white hover:bg-gray-50 transition text-center font-semibold"
          >
            شوف العروض
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [books] = useState([
    { id: 1, title: 'ONYX STORM', author: 'rebecca yarros ', price: 450000, image: '/$_57.jpeg' },
    { id: 2, title: 'STORY OF MY LIFE', author: 'LUCY SCORE', price: 280000, image: '/9781728297057.jpeg' },
    { id: 3, title: 'WATCH ME', author: 'TAHEREH MAFI', price: 440000, image: '/9780063425187_1_01_1.jpg' },
  ])

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    localStorage.setItem('cart', JSON.stringify([...cart, book]))
    alert(`✅ تمت إضافة "${book.title}" إلى السلة`)
  }

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={container}
      className="min-h-screen text-right"
      dir="rtl"
    >
      {/* خلفية ألطف */}
      <div className="bg-gradient-to-b from-[#F9F2F4] via-[#F4EDE4] to-[#F4F7F5]">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-4 md:space-y-6">
          {/* عرض علوي */}
          <motion.div variants={section}>
            <BannerOffer />
          </motion.div>

          {/* Hero بسيط */}
          <motion.section
            variants={section}
            className="rounded-3xl overflow-hidden border bg-white/70 backdrop-blur shadow-sm"
          >
            <div className="p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28]">
                  أهلاً في <span className="text-[#C05370]">Blooms</span> 📚
                </h1>
                <p className="mt-2 text-sm md:text-base text-gray-600 leading-relaxed">
                  كتب، مانجا، وسلاسل مميزة — توصيات جديدة يوميًا وعروض قوية لفترة محدودة.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/books"
                  className="px-5 py-2.5 rounded-full bg-[#C05370] text-white hover:opacity-90 transition"
                >
                  تصفّح الكتب
                </Link>
                <Link
                  href="/offers"
                  className="px-5 py-2.5 rounded-full border bg-white hover:bg-gray-50 transition"
                >
                  شوف العروض
                </Link>
              </div>
            </div>
          </motion.section>

          {/* بحث موبايل */}
          <motion.div variants={section}>
            <MobileSearchBar />
          </motion.div>

          {/* سلايدر */}
          <Section>
            <Slider />
          </Section>

          {/* جديد الكتب */}
          <Section>
            <NewBooks />
          </Section>

          {/* أحدث السلاسل */}
          <Section>
            <LatestSeries />
          </Section>

          {/* خصومات */}
          <Section>
            <HomeDiscountedBooks />
          </Section>

          {/* ✅ Pre-Order Promo */}
          <motion.div variants={section}>
            <PreOrderPromo />
          </motion.div>

          {/* التصنيفات */}
          <Section>
            <CategoriesGrid />
          </Section>

          {/* مانجا */}
          <Section>
            <LatestManga />
          </Section>

          {/* لماذا نحن */}
          <Section>
            <WhyUs />
          </Section>

          
          <motion.div variants={section} className="text-center text-xs text-gray-500 py-2">
            © {new Date().getFullYear()} Blooms Bookstore — كل الحقوق محفوظة
          </motion.div>
        </div>
      </div>
    </motion.main>
  )
}
