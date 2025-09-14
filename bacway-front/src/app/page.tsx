import Hero from "@/components/landingPage/hero/Hero";
import Library from "@/components/landingPage/Library/Library";
import Info from "@/components/landingPage/info/Info";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <section className="flex bg-[rgb(12,17,20)] border-t-1 border-white/50 flex-col items-center w-full m-0">
        <Library />
        <Info />
      </section>
    </main>
  );
}
