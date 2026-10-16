import { Header } from "@/components/layout/Header";

import { Footer } from "@/components/layout/Footer";
function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-12"></main>
      <Footer />
    </div>
  );
}

export default App;
