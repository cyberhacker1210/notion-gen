export default function Comparaison() {
    return(
        <section className="py-24 bg-white px-6">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
                    Pourquoi NotionGen
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-red-50 border border-red-100 p-8 rounded-2xl">
                        <h3 className="text-xl font-bold text-red-900 mb-6">Sans NotionGen 😩</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-red-800">
                                <span className="text-xl">❌</span>
                                <span>Perdre des heures sur YouTube à comprendre les "Relations".</span>
                            </li>
                            <li className="flex items-start gap-3 text-red-800">
                                <span className="text-xl">❌</span>
                                <span>Acheter un template à 30€ trop complexe et inutile.</span>
                            </li>
                            <li className="flex items-start gap-3 text-red-800">
                                <span className="text-xl">❌</span>
                                <span>Un Notion vide qui stresse au lieu d'aider.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-green-50 border border-green-100 p-8 rounded-2xl">
                        <h3 className="text-xl font-bold text-green-900 mb-6">Avec NotionGen 🚀</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-green-800 font-medium">
                                <span className="text-xl">✅</span>
                                <span>Ton système complet généré en 30 secondes chrono.</span>
                            </li>
                            <li className="flex items-start gap-3 text-green-800 font-medium">
                                <span className="text-xl">✅</span>
                                <span>100% adapté à TON flux de travail unique.</span>
                            </li>
                            <li className="flex items-start gap-3 text-green-800 font-medium">
                                <span className="text-xl">✅</span>
                                <span>Tu te concentres sur tes tâches, pas sur l'outil.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}