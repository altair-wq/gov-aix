import { DashboardMetrics, AgentPerformance } from '@/lib/services/types';

type Rng = () => number;

/** Mulberry32: tiny seeded PRNG so the first render is identical on server and client. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const int = (rng: Rng, min: number, span: number) => min + Math.floor(rng() * span);

export function generateMockMetrics(rng: Rng = Math.random): DashboardMetrics {
  return {
    speedImprovement: int(rng, 85, 30), // 85-114x
    costReduction: int(rng, 65, 25), // 65-89%
    languagesServed: int(rng, 12, 8), // 12-19 languages
    agentSuccessRate: int(rng, 92, 8), // 92-99%
  };
}

const AGENTS = [
  'Business License Agent',
  'Permit Processing Agent',
  'Citizen Service Agent',
  'Compliance Checker Agent',
];

export function generateMockAgentPerformance(rng: Rng = Math.random): AgentPerformance[] {
  return AGENTS.map((agent) => ({
    agent,
    avgLatency: int(rng, 150, 300), // 150-449ms
    successRate: int(rng, 88, 12), // 88-99%
    callsToday: int(rng, 25, 75), // 25-99 calls
  }));
}
