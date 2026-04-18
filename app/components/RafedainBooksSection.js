/* 🔥 سكشن دار الرافدين */
function RafedainBooksSection() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const { data } = await supabase
      .from('books')
      .select('*')
      .eq('category', 'rafedain') // 🔥 مهم
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
      {/* العنوان */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-[#2E2A28]">
          📚 دار الرافدين
        </h2>

        <Link
          href="/books?filter=rafedain"
          className="text-sm font-bold text-[#C05370] hover:underline"
        >
          عرض الكل
        </Link>
      </div>

      {/* المحتوى */}
      {books.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          لا يوجد كتب حالياً
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="rounded-3xl overflow-hidden bg-white shadow hover:shadow-xl transition group"
            >
              {/* صورة */}
              <div className="relative h-56 bg-gray-50">
                <Image
                  src={book.image || '/fallback.jpg'}
                  alt={book.title}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition"
                />
              </div>

              {/* معلومات */}
              <div className="p-4 space-y-2">
                <p className="font-bold text-sm line-clamp-2">
                  {book.title}
                </p>

                <p className="text-[#C05370] font-extrabold">
                  {Number(book.price).toLocaleString()} ل.س
                </p>

                <button
                  onClick={() => addToCart(book)}
                  className="w-full bg-[#4C7A68] text-white py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition"
                >
                  🛒 إضافة إلى السلة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}