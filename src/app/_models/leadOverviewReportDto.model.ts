import { Lead } from "./lead.model";

export interface LeadOverviewReportDto {
  // KPIs
  totalLeads: number;
  increaseDecreseInTotalLeadsPercentage: number;

  totalLeadsConverted: number;
  increaseDecreseInTotalLeadsConvertedPercentage: number;

  conversionRate: number;
  increaseDecreseInConversionRatePercentage: number;

  costPerLead: number;
  increaseDecreseInCostPerLeadPercentage: number;

  costPerConversion: number;
  increaseDecreseInCostPerConversionPercentage: number;

  totalAdSpend: number;
  increaseDecreseInTotalAdSpendPercentage: number;

  // Lead Status Distribution
  totalLeadsInNew: number;
  totalLeadsInAttorneyReview: number;
  totalLeadsQualified: number;
  totalLeadsUnqualified: number;
  totalLeadsConvertedToSales: number;

  // Preferred Contact Method
  totalLeadsRequestingEmailContact: number;
  totalLeadsRequestingPhoneContact: number;

  // Preferred Language
  totalLeadsRequestingEnglish: number;
  totalLeadsRequestingZulu: number;
  totalLeadsRequestingAfrikaans: number;

  // Lead Acquisition Trend
  newLeads: number;
  convertedLeads: number;

  // Accident Date
  totalAccidentDatesIn2025: number;
  totalAccidentDatesIn2024: number;
  totalAccidentDatesIn2023: number;
  totalAccidentDatesIn2022: number;
  totalAccidentDatesIn2021: number;
  totalAccidentDatesOther: number;

  // Recent Leads
  recentLeads?: Lead[];
}
