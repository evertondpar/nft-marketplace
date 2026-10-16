export default function BlogSection() {
  return (
    <section className="mt-24 mb-10">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-mono font-bold text-foreground mb-2">
          Diário da Cunhagem
        </h2>
        <p className="text-muted-foreground text-sm font-mono">
          Histórias, guias e insights para colecionadores sobre o universo da
          propriedade digital.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            img: "13",
            title: "Como funciona a propriedade de NFTs",
            time: "12 de setembro | Leitura de 4 min",
          },
          {
            img: "14",
            title: "10 artistas digitais para acompanhar",
            time: "13 de setembro | Leitura de 2 min",
          },
          {
            img: "15",
            title: "Raridade, atributos e procedência",
            time: "15 de setembro | Leitura de 3 min",
          },
          {
            img: "16",
            title: "Como proteger sua carteira",
            time: "15 de setembro | Leitura de 2 min",
          },
        ].map((post, i) => (
          <div
            key={i}
            className="bg-secondary/40 rounded-xl overflow-hidden border border-border/50 cursor-pointer group"
          >
            <div className="aspect-[4/3] bg-secondary overflow-hidden">
              <img
                src={`https://i.pravatar.cc/400?img=${post.img}`}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <p className="text-[10px] font-mono text-muted-foreground mb-2 uppercase">
                {post.time}
              </p>
              <h3 className="font-bold text-foreground mb-2 text-sm">
                {post.title}
              </h3>
              <p className="text-xs text-primary mt-4 font-mono group-hover:underline">
                Ler mais →
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
