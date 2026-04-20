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
 

 

  /* 🔥 جديد */
  {
    title: 'دار عصير الكتب',
    image: '/images.png', // حط صورة مناسبة
    link: '/books?filter=aseer',
  },
  {
    title: 'دار الرافدين',
    image: '/667ab4e396b94-1719317731.png', // حط صورة مناسبة
    link: '/books?filter=rafedain',
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
            <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group cursor-pointer">
              
              {/* صورة */}
              <div className="relative w-full h-36 sm:h-44 md:h-48">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* عنوان */}
              <div className="p-3 text-sm sm:text-base font-bold text-gray-800 flex items-center justify-between">
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