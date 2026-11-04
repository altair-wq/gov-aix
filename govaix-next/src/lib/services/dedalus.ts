import { AgentResponse, AgentType, CitizenServiceReply } from './types';
import { delay } from './util';

const LATENCIES: Record<AgentType, number> = { license: 150, permit: 200, 'citizen-service': 180 };

export async function initMCP(): Promise<AgentResponse<{ agents: AgentType[] }>> {
  await delay(100);
  return {
    success: true,
    message: 'MCP servers initialized successfully',
    data: { agents: ['license', 'permit', 'citizen-service'] },
    timestamp: new Date().toISOString(),
  };
}

const CITIZEN_REPLY: CitizenServiceReply['reply'] = {
  en: 'Thank you for your inquiry. To apply for a restaurant business permit, please submit your business registration number, floor plan, and food hygiene manager certificate. You can start the application online now.',
  ja: 'お問い合わせありがとうございます。飲食店営業許可の申請には、法人登記番号、店舗の平面図、食品衛生責任者の資格証明書が必要です。今すぐオンラインで申請を開始できます。',
};

export async function routeToAgent(
  type: 'citizen-service',
  payload: Record<string, unknown>,
): Promise<AgentResponse<CitizenServiceReply>>;
export async function routeToAgent(
  type: AgentType,
  payload: Record<string, unknown>,
): Promise<AgentResponse<{ referenceId: string }>>;
export async function routeToAgent(
  type: AgentType,
  payload: Record<string, unknown>,
): Promise<AgentResponse<CitizenServiceReply | { referenceId: string }>> {
  void payload; // forwarded to the real Dedalus endpoint once wired up
  await delay(LATENCIES[type]);

  if (type === 'citizen-service') {
    return {
      success: true,
      message: CITIZEN_REPLY.en,
      data: { reply: CITIZEN_REPLY },
      timestamp: new Date().toISOString(),
    };
  }

  const referenceId = `${type.toUpperCase().slice(0, 3)}-${Date.now().toString(36).toUpperCase()}`;
  return {
    success: true,
    message: `Application routed to the ${type} agent. Reference ${referenceId}.`,
    data: { referenceId },
    timestamp: new Date().toISOString(),
  };
}
