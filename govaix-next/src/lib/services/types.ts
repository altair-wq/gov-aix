export interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

export interface BusinessVerification {
  verified: boolean;
  status: 'Verified' | 'Needs Review' | 'Rejected';
  confidence: number;
  details: {
    name: string;
    registrationId: string;
    registrationDate?: string;
    status: string;
  };
}

export interface ComplianceCode {
  code: string;
  language: string;
  description: string;
  complianceLevel: 'Basic' | 'Standard' | 'Enhanced';
}

export interface Translation {
  original: string;
  translated: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface AudioData {
  text: string;
  audioUrl: string;
  duration: number;
  language: string;
}

export interface DashboardMetrics {
  speedImprovement: number; // x times faster
  costReduction: number; // percentage
  languagesServed: number; // count
  agentSuccessRate: number; // percentage
}

export interface AgentPerformance {
  agent: string;
  avgLatency: number; // milliseconds
  successRate: number; // percentage
  callsToday: number;
}