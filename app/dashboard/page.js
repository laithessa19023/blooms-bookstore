'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FiBookOpen,
  FiPlusCircle,
  FiShoppingCart,
  FiClipboard,
  FiBarChart2,
  FiSearch,
  FiSettings,
  FiPackage,
  FiGift,
  FiLayers,
  FiLogOut,
} from 'react-icons/fi'

const cards = [
  {
    title: 'إدارة الكتب',
    desc: 'عرض، تعديل، حذف الكتب',
    href: '/dashboard/books',
    icon: FiBookOpen,
    tag: 'كتب',
  },
  {
    title: 'إضافة كتاب جديد',
    desc: 'إضافة كتاب مع صورة وسعر وتصنيف',
    href: '/dashboard/add-book',
    icon: FiPlusCircle,
    tag: 'كتب',
  },
  {
    title: 'إدارة المنتجات',
    desc: 'بوك مارك، فيغرات، إكسسوارات…',
    href: '/dashboard/products',
    icon: FiShoppingCart,
    tag: 'منتجات',
  },
  {
    title: 'إضافة منتج جديد',
    desc: 'أضف منتج جديد مع التصنيف والسعر',
    href: '/dashboard/add-product',
    icon: FiPlusCircle,
    tag: 'منتجات',
  },
  {
    title: 'عرض الطلبات',
    desc: 'طلبات العملاء وتفاصيل التوصيل',
    href: '/dashboard/orders',
    icon: FiClipboard,
    tag: 'طلبات',
  },
  {
    title: 'التقارير والإحصائيات',
    desc: 'مبيعات، طلبات، أفضل المنتجات',
    href: '/dashboard/reports',
    icon: FiBarChart2,
    tag: 'تقارير',
  },
  {
    title: 'طلبات الكتب غير الموجودة',
    desc: 'طلبات البحث عن كتب غير متوفرة',
    href: '/dashboard/missing-books',
    icon: FiSearch,
    tag: 'طلبات',
  },
  {
  title: 'طلبات Pre-Order (كتب أصلية)',
  desc: 'عرض طلبات الكتب الأصلية مع معلومات التواصل',
  href: '/dashboard/preorders',
  icon: FiPackage,
  tag: 'طلبات',
},

  {
    title: 'إدارة المجموعات (سلاسل)',
    desc: 'تنظيم السلاسل وربط الكتب فيها',
    href: '/dashboard/add-series',
    icon: FiPackage,
    tag: 'محتوى',
  },
  {
    title: 'إدارة العروض المميزة',
    desc: 'عرض وتعديل خصومات الكتب',
    href: '/dashboard/offers',
    icon: FiGift,
    tag: 'عروض',
  },
  {
    title: 'إضافة مانجا',
    desc: 'إضافة مانجا جديدة وإدارتها',
    href: '/dashboard/add-manga',
    icon: FiLayers,
    tag: 'محتوى',
  },
  {
    title: 'الإعدادات العامة',
    desc: 'خيارات الموقع والمحتوى العام',
    href: '/dashboard/settings',
    icon: FiSettings,
    tag: 'إعدادات',
  },
]

const tagStyles = {
  كتب: 'bg-[#F9F2F4] text-[#C05370] border-[#F2D6DE]',
  منتجات: 'bg-[#EEF6F2] text-[#4C7A68] border-[#D7EAE1]',
  طلبات: 'bg-[#FFF7E6] text-[#D9A441] border-[#F3E2B8]',
  تقارير: 'bg-[#F2EEFF] text-[#7851A9] border-[#E0D6FF]',
  محتوى: 'bg-[#EEF4FF] text-[#1E90FF] border-[#D6E6FF]',
  عروض: 'bg-[#FFF1EA] text-[#FF7F50] border-[#FFD8C9]',
  إعدادات: 'bg-gray-50 text-gray-700 border-gray-200',
}

function AdminCard({ item }) {
  const Icon = item.icon
  const tagClass = tagStyles[item.tag] || tagStyles['إعدادات']

  return (
    <Link
      href={item.href}
      className="group rounded-3xl border bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-11 h-11 rounded-2xl border bg-white flex items-center justify-center">
          <Icon className="text-xl text-gray-700 group-hover:scale-105 transition" />
        </div>

        <span className={`text-xs px-3 py-1 rounded-full border ${tagClass}`}>
          {item.tag}
        </span>
      </div>

      <div>
        <h3 className="text-base font-extrabold text-[#2E2A28]">{item.title}</h3>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.desc}</p>
      </div>

      <div className="mt-auto text-sm font-semibold text-[#C05370] group-hover:underline">
        فتح →
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    router.push('/admin-login')
  }

  return (
    <main dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-[#F4EDE4] to-[#F4F7F5]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28]">
              لوحة التحكم <span className="text-[#C05370]">📊</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              إدارة الكتب، المنتجات، الطلبات والعروض من مكان واحد
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-red-200 bg-white/80 text-red-600 hover:bg-red-50 transition w-full md:w-auto"
          >
            <FiLogOut /> تسجيل الخروج
          </button>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((item) => (
            <AdminCard key={item.href} item={item} />
          ))}
        </div>
      </div>
    </main>
  )
}
