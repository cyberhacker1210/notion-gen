export default function HowItWorks() {
    return(
        <section className="py-24 bg-gray-50 px-6">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-900">
                    Comment ça marche ?
                </h2>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-blue-600 font-black text-xl mb-4">01.</div>
                        <h3 className="text-xl font-bold text-gray-900">Décris</h3>
                        <p className="mt-4 text-gray-600 leading-relaxed">
                            Dis à l'IA ce que tu veux gérer : tes finances, tes cours, ton agence... Plus tu es précis, mieux c'est.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-blue-600 font-black text-xl mb-4">02.</div>
                        <h3 className="text-xl font-bold text-gray-900">L'IA Construit</h3>
                        <p className="mt-4 text-gray-600 leading-relaxed">Notre moteur génère les bases de données, les relations et les vues dashboard optimisées pour ton besoin.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-blue-600 font-black text-xl mb-4">03.</div>
                        <h3 className="text-xl font-bold text-gray-900">Duplique & Profite</h3>
                        <p className="mt-4 text-gray-600 leading-relaxed">Clique sur le lien, duplique dans ton Notion. C'est prêt. Tu as gagné 4 heures de travail.</p>
                    </div>
                </div>
            </div>
        </section>
        
    )
}