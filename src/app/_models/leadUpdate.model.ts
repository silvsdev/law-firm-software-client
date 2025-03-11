export interface LeadUpdate {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferredContactMethod: string;
  preferredLanguage: string;
  accidentDate: string;
  status?: string;
}
