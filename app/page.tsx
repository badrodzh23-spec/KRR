export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">KRR</div>
          <div className="flex gap-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">الرئيسية</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">المميزات</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">حول</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            مرحباً بك في <span className="text-blue-600">KRR</span>
          </h1>
          <p className="text-xl text-gray-600">
            منصة حديثة وقوية مبنية بأحدث التقنيات لتحقيق أهدافك
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition">
              ابدأ الآن
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition">
              اعرف أكثر
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">المميزات الرئيسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'سريع وفعال', description: 'أداء عالي وسرعة فائقة في جميع العمليات' },
              { title: 'آمن تماماً', description: 'حماية عالية المستوى لبيانات المستخدمين' },
              { title: 'سهل الاستخدام', description: 'واجهة بديهية وسهلة التعامل معها' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">هل أنت مستعد للبدء؟</h2>
          <p className="text-lg mb-8 opacity-90">انضم إلى آلاف المستخدمين الذين يثقون بنا</p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition">
            اشترك مجاناً
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>© 2024 KRR. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </main>
  )
}
