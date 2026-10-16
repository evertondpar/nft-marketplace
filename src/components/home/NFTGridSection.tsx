import { Button } from "../ui/button";

export default function NFTGridSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
      {/* Banner 1 */}
      <div className="flex bg-secondary/40 rounded-2xl overflow-hidden border border-border/50">
        <div className="w-1/2 bg-secondary">
          <img
            src="https://i.pravatar.cc/400?img=11"
            alt="Macaco"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-1/2 p-6 flex flex-col justify-center">
          <h3 className="font-mono font-bold text-foreground mb-2 text-sm uppercase">
            Lançamentos gênesis
            <br />
            de edição limitada
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Colecione edições escassas diretamente dos criadores antes da
            revelação pública.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="w-fit bg-primary/20 text-primary hover:bg-primary/30"
          >
            Explorar →
          </Button>
        </div>
      </div>

      {/* Banner 2 */}
      <div className="flex bg-secondary/40 rounded-2xl overflow-hidden border border-border/50">
        <div className="w-1/2 bg-secondary">
          <img
            src="https://i.pravatar.cc/400?img=12"
            alt="Macaco de terno"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-1/2 p-6 flex flex-col justify-center">
          <h3 className="font-mono font-bold text-foreground mb-2 text-sm uppercase">
            Arte digital selecionada
            <br />e muito mais
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Explore novos artistas, coleções verificadas e obras digitais que
            definem a cultura.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="w-fit bg-primary/20 text-primary hover:bg-primary/30"
          >
            Explorar →
          </Button>
        </div>
      </div>
    </section>
  );
}
