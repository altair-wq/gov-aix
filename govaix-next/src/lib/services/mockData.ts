import { DashboardMetrics, AgentPerformance } from '@/lib/services/types';

export function generateMockMetrics(): DashboardMetrics {
  return {
    speedImprovement: 85 + Math.floor(Math.random() * 30), // 85-115x
    costReduction: 65 + Math.floor(Math.random() * 25), // 65-90%
    languagesServed: 12 + Math.floor(Math.random() * 8), // 12-20 languages
    agentSuccessRate: 92 + Math.floor(Math.random() * 8) // 92-100%
  };
}

export function generateMockAgentPerformance(): AgentPerformance[] {
  const agents = [
    { name: 'Business License Agent', type: 'license' },
    { name: 'Permit Processing Agent', type: 'permit' },
    { name: 'Citizen Service Agent', type: 'citizen-service' },
    { name: 'Compliance Checker Agent', type: 'compliance' }
  ];

  return agents.map(agent => ({
    agent: agent.name,
    avgLatency: 150 + Math.floor(Math.random() * 300), // 150-450ms
    successRate: 88 + Math.floor(Math.random() * 12), // 88-100%
    callsToday: 25 + Math.floor(Math.random() * 75) // 25-100 calls
  }));
}