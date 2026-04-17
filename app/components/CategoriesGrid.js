'use client'

import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    title: 'جميع الكتب',
    image: '/494819675_1794324948163973_3416483601012165536_n.jpg',
    link: '/books',
  },
  {
    title: 'كتب عربية',
    image: '/arabic-books.jpg',
    link: '/books?filter=arabic',
  },
  {
    title: 'كتب إنجليزية',
    image: '/sdafaf.JPG',
    link: '/books?filter=english',
  },
  {
    title: 'كتب أصلية (أورجنال)',
    image: '/Untitleddesign.png',
    link: '/books?filter=original',
  },
  {
    title: 'كتب للأطفال',
    image: '/700.jpeg',
    link: '/books?filter=kids',
  },
]

export default function CategoriesGrid() {
  return (
    <section className="px-4 py-10 text-right" dir="rtl">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#C05370] mb-6">
        تصنيفات الكتب
      </h2>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {categories.map((cat, idx) => (
          <Link key={idx} href={cat.link}>
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group cursor-pointer">
              <div className="relative w-full h-36 sm:h-44 md:h-48">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-3 text-sm sm:text-base font-semibold text-gray-800 flex items-center justify-between">
                <span>{cat.title}</span>
                <span className="text-[#C05370] transition-transform group-hover:-translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}