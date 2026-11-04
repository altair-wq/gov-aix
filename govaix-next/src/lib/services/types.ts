export type AgentType = 'license' | 'permit' | 'citizen-service';

export interface AgentResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface CitizenServiceReply {
  reply: { en: string; ja: string };
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

export interface CompanyEnrichment {
  companyName: string;
  industry: string;
  employeeCount: string;
  annualRevenue: string;
  foundedYear: number;
  headquarters: string;
  businessType: string;
  creditScore: string;
  riskLevel: 'Low' | 'Medium' | 'High';
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
  /** BCP-47 tag for the speech engine, e.g. "ja-JP". */
  language: string;
  /** Estimated playback duration in seconds. */
  duration: number;
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
