export default function Comparison() {
  return (
    <section className="py-32 bg-white px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-20 tracking-tight">
          Pourquoi NotionGen ?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="bg-gradient-to-b from-red-50/50 to-white border border-red-100 p-10 rounded-[2rem] opacity-90">
            <h3 className="text-2xl font-bold text-red-900 mb-8 flex items-center gap-3">
              <span className="p-2 bg-red-100 rounded-xl">😩</span> Sans NotionGen
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-gray-600 text-lg">
                <span className="text-red-500 font-bold mt-1">✗</span>
                <span>Perdre des heures sur YouTube à comprendre les "Relations".</span>
              </li>
              <li className="flex items-start gap-4 text-gray-600 text-lg">
                <span className="text-red-500 font-bold mt-1">✗</span>
                <span>Acheter un template à 30€ trop complexe et inutile.</span>
              </li>
              <li className="flex items-start gap-4 text-gray-600 text-lg">
                <span className="text-red-500 font-bold mt-1">✗</span>
                <span>Un Notion vide qui stresse au lieu d'aider.</span>
              </li>
            </ul>
          </div>

          <div className="relative bg-gradient-to-b from-green-50 to-white border border-green-200 p-10 rounded-[2rem] shadow-2xl shadow-green-900/10 md:scale-105 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              La Solution
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-8 flex items-center gap-3">
              <span className="p-2 bg-green-100 rounded-xl">🚀</span> Avec NotionGen
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-gray-800 text-lg font-medium">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span>Ton système complet généré en 30 secondes chrono.</span>
              </li>
              <li className="flex items-start gap-4 text-gray-800 text-lg font-medium">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span>100% adapté à TON flux de travail unique.</span>
              </li>
              <li className="flex items-start gap-4 text-gray-800 text-lg font-medium">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span>Tu te concentres sur tes tâches, pas sur l'outil.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}