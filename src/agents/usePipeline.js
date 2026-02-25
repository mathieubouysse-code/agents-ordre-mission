import { useState } from "react";
import { callAgent } from "./api";
import { AGENTS, STEPS } from "./definitions";

export function usePipeline() {
  const [phase, setPhase]          = useState("accueil");
  const [currentAgent, setCurrent] = useState(null);
  const [results, setResults]      = useState({});
  const [error, setError]          = useState(null);

  const reset = () => {
    setPhase("accueil");
    setCurrent(null);
    setResults({});
    setError(null);
  };

  const launch = async (contexteApp) => {
    setPhase("building");
    setResults({});
    setError(null);
    let collected = {};

    const run = async (agentId, userMessage) => {
      setCurrent(agentId);
      await new Promise((r) => setTimeout(r, 500));
      const res = await callAgent(AGENTS[agentId].prompt, userMessage);
      collected[agentId] = res;
      setResults((prev) => ({ ...prev, [agentId]: res }));
      await new Promise((r) => setTimeout(r, 400));
      return res;
    };

    try {
      const audit = await run("auditeur", `Analyse cette application :\n${contexteApp}`);
      const arch  = await run("architecte", `Audit :\n${JSON.stringify(audit)}\nApp :\n${contexteApp}`);
      const corrections = await run("correcteur", `Bugs :\n${JSON.stringify(audit.bugs_critiques)}\nArchi :\n${JSON.stringify(audit.problemes_architecture)}\nContexte :\n${contexteApp}`);
      await run("testeur", `Corrections :\n${JSON.stringify(corrections)}\nContexte :\n${contexteApp}`);
      await run("comparateur", `Audit : ${JSON.stringify(audit)}\nArchitecture : ${JSON.stringify(arch)}\nCorrections : ${JSON.stringify(corrections)}`);
      setCurrent(null);
      setPhase("result");
    } catch (err) {
      setError(err.message);
      setCurrent(null);
      setPhase("result");
    }
  };

  return { phase, currentAgent, results, error, launch, reset, STEPS, AGENTS };
}