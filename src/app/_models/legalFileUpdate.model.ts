export interface LegalFileUpdate {
  id: string;
  fileReference: string;
  clientReference?: string;
  fullName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfInstruction?: string;
  dateOfAccident?: string;
  status?: string;
  fileType?: string;
  ownerId: string;
}
