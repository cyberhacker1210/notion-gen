export default function HowItWorks() {
  return (
    <section className="py-32 bg-gray-50 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 tracking-tight">
          Comment ça marche ?
        </h2>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="group relative bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="absolute -inset-px bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-5xl font-black bg-gradient-to-br from-blue-600 to-violet-600 bg-clip-text text-transparent mb-6 opacity-80">
                01.
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Décris</h3>
              <p className="mt-4 text-gray-600 leading-relaxed text-lg">
                Dis à l'IA ce que tu veux gérer : tes finances, tes cours, ton agence... Plus tu es précis, mieux c'est.
              </p>
            </div>
          </div>

          <div className="group relative bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="absolute -inset-px bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-5xl font-black bg-gradient-to-br from-blue-600 to-violet-600 bg-clip-text text-transparent mb-6 opacity-80">
                02.
              </div>
              <h3 className="text-2xl font-bold text-gray-900">L'IA Construit</h3>
              <p className="mt-4 text-gray-600 leading-relaxed text-lg">
                Notre moteur génère les bases de données, les relations et les vues dashboard optimisées pour ton besoin.
              </p>
            </div>
          </div>

          <div className="group relative bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="absolute -inset-px bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-5xl font-black bg-gradient-to-br from-blue-600 to-violet-600 bg-clip-text text-transparent mb-6 opacity-80">
                03.
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Duplique & Profite</h3>
              <p className="mt-4 text-gray-600 leading-relaxed text-lg">
                Clique sur le lien, duplique dans ton Notion. C'est prêt. Tu as gagné 4 heures de travail.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}