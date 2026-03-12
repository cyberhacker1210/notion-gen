export default function Hero() {
    return(
        <section className="relative flex flex-col items-center text-center px-6 py-32 overflow-hidden">
            <div className="absolute top-0 -z-10 h-full w-full bg-white">
                <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-blue-100/50 opacity-50 blur-[80px]"></div>
                 <div className="absolute bottom-auto left-0 right-auto top-0 h-[500px] w-[500px] translate-x-[30%] translate-y-[20%] rounded-full bg-purple-100/50 opacity-50 blur-[80px]"></div>     
            </div>
            <div className="mb-8 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                Accés Beta Limité
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight max-w-4xl leading-tight">
                Ton Notion sur-mesure. <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    Généré en un clic.
                </span>
            </h1>
            <p className="mt-8 text-xl text-gray-600 max-w-2xl leading-relaxed">
                Ne perds plus des heures à configurer. Décris simplement ton besoin à l'IA, et obtiens un template complet avec bases de données, pages et liens. Prêt à l'emploi instantanément.
            </p>
            <a href="/generate" className="mt-12 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] flex items-center gap-2">
                Je veux générer mon premier template
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </a>
            <p className="mt-6 text-sm text-gray-500 font-medium">
                ⚡ Déjà +100 templates générés cette semaine
            </p>

        </section>

    )
}