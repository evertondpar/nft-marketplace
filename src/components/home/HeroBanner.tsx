import { Button } from "../ui/button";

export default function HeroBanner() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
      <div className="flex-1 max-w-2xl">
        <p className="text-muted-foreground font-mono text-sm mb-4 tracking-widest uppercase">
          Bem-vindo à Kurio
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
          SEJA DONO DO FUTURO
          <br />
          DA ARTE DIGITAL
        </h1>
        <p className="text-muted-foreground mb-8 max-w-lg text-sm md:text-base leading-relaxed">
          Descubra NFTs selecionados de criadores emergentes e consagrados.
          Colecione arte digital rara, apoie artistas e tenha uma parte da
          cultura da internet.
        </p>
        <Button className="font-bold px-8 py-6 text-sm bg-primary hover:bg-primary/90 text-primary-foreground">
          EXPLORAR
        </Button>
      </div>

      <div className="w-full md:w-[400px] lg:w-[480px] aspect-square rounded-2xl overflow-hidden bg-secondary">
        {/* Imagem de destaque temporária (Substituir pela imagem real do casaco verde) */}
        <img
          src="https://i.pravatar.cc/600?img=11"
          alt="Macaco com casaco verde"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
