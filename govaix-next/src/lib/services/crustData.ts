import { BusinessVerification } from './types';

const CRUSTDATA_API_KEY = process.env.NEXT_PUBLIC_CRUSTDATA_API_KEY || 'mock-key';

export async function verifyBusiness(name: string, regId: string): Promise<BusinessVerification> {
  // Simulate business verification with delay
  await new Promise(resolve => setTimeout(resolve, 180));
  
  // Mock verification logic
  const verified = Math.random() > 0.3; // 70% success rate
  const confidence = verified ? 0.85 + Math.random() * 0.15 : 0.2 + Math.random() * 0.3;
  
  return {
    verified,
    status: verified ? 'Verified' : 'Needs Review',
    confidence: Math.round(confidence * 100),
    details: {
      name,
      registrationId: regId,
      registrationDate: verified ? '2023-01-15' : undefined,
      status: verified ? 'Active' : 'Pending Review'
    }
  };
}

export async function enrichCompany(name: string): Promise<any> {
  // Simulate company data enrichment
  await new Promise(resolve => setTimeout(resolve, 140));
  
  return {
    companyName: name,
    industry: 'Food & Beverage',
    employeeCount: '10-50',
    annualRevenue: '$1M-$5M',
    foundedYear: 2020,
    headquarters: 'Tokyo, Japan',
    businessType: 'Private Limited',
    creditScore: 'A-',
    riskLevel: 'Low'
  };
}