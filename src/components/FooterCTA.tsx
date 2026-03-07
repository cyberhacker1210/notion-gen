'use client'

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function FooterCTA() {
    const [email,setEmail] = useState("");
    const [isSubmited, setIsSubmited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (email === "") return;
        setIsLoading(true);
        
        const { error } = await supabase
        .from("waitlist")
        .insert([{ email: email }]);

        setIsLoading(false);

        if (error) {
            console.error("Erreur Supabase", error);
            if (error.code === '23505') {
                alert("Tu es déjà sur la liste d'attente.")
        }   else {
            alert("Oups, une erreur est survenue. Réessaie !")
        }
        return;
        }
        setIsSubmited(true)
    }
    return(
        <section className="py-24 bg-gray-900 px-6 text-center">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                    Rejoins la révolution No-Code.
                </h2>
                <p className="mt-6 text-lg text-gray-400">
                    L'accès à la Beta sera limité aux <span className="text-blue-400 font-bold">100 premiers inscrits</span>.Ne rate pas ta place.
                </p>
            </div>
            {isSubmited ? (
                <div className="mt-10 p-6 bg-green-900/30 border border-green-500 rounded-xl">
                    <h3 className="text-2xl font-bold text-green-400">🎉 Tu es sur la liste !</h3>
                    <p className="mt-2 text-green-200">Surveille tes emails, on te contacte très vite.</p>
                </div>
            ):(
                <form action={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                    <input type="email"
                           placeholder="Ton email ici"
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="px-6 py-4 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 w-full sm:w-auto flex-1"
                        />
                    <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-500 hover:scale-105 transition-all shadow-lg">
                        Je veux générer mon premier template
                    </button>
                </form>
            
            )}
        </section>

    )
}