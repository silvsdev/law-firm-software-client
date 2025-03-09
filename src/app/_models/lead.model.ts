export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferredContactMethod: string;
  preferredLanguage: string;
  accidentDate: string;
  source: string;
  createdDate: string;
  status?: string;
}
