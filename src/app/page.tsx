import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import HowItWorks from "@/components/HowItWorks"
import Comparaison from "@/components/Comparaison"
import FooterCTA from "@/components/FooterCTA"

export default function HomePage() {
return(
  <main className="min-h-screen bg-white">
    <Navbar/>
    <Hero/>
    <HowItWorks/>
    <Comparaison/>
    <FooterCTA/>
  </main>
)

}