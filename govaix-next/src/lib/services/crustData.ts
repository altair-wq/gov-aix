import { BusinessVerification, CompanyEnrichment } from './types';
import { delay, seededRandom } from './util';

export async function verifyBusiness(name: string, regId: string): Promise<BusinessVerification> {
  await delay(180);

  // Deterministic per (name, regId) so re-submitting the same business gives
  // the same answer, as a real registry lookup would.
  const r = seededRandom(`${name.trim().toLowerCase()}|${regId.trim().toUpperCase()}`);
  const verified = r > 0.3; // ~70% verify
  const confidence = verified ? 0.85 + r * 0.15 : 0.2 + r * 0.3;

  return {
    verified,
    status: verified ? 'Verified' : 'Needs Review',
    confidence: Math.min(99, Math.round(confidence * 100)),
    details: {
      name,
      registrationId: regId,
      registrationDate: verified ? '2023-01-15' : undefined,
      status: verified ? 'Active' : 'Pending Review',
    },
  };
}

export async function enrichCompany(name: string): Promise<CompanyEnrichment> {
  await delay(140);

  return {
    companyName: name,
    industry: 'Food & Beverage',
    employeeCount: '10-50',
    annualRevenue: '$1M-$5M',
    foundedYear: 2020,
    headquarters: 'Tokyo, Japan',
    businessType: 'Private Limited',
    creditScore: 'A-',
    riskLevel: 'Low',
  };
}
