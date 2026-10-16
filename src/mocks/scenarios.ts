export type MswScenario =
  | "none"
  | "slow_network"
  | "server_error"
  | "session_expired"
  | "stock_conflict";

class ScenarioManager {
  private currentScenario: MswScenario = "none";

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("msw_scenario") as MswScenario;
      if (saved) this.currentScenario = saved;
    }
  }

  setScenario(scenario: MswScenario) {
    this.currentScenario = scenario;
    if (typeof window !== "undefined") {
      localStorage.setItem("msw_scenario", scenario);
    }
    console.log(`[MSW Fixtures] Cenário atual alterado para: "${scenario}"`);
  }

  getScenario(): MswScenario {
    return this.currentScenario;
  }

  reset() {
    this.setScenario("none");
  }
}

export const scenarioManager = new ScenarioManager();

// Exposição global no window para testes rápidos pelo console
if (typeof window !== "undefined") {
  (window as any).setMswScenario = (scenario: MswScenario) =>
    scenarioManager.setScenario(scenario);
  (window as any).resetMswScenario = () => scenarioManager.reset();
}
