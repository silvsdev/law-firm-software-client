export interface LegalFile {
  id: string;
  fileReference: string;
  clientReference?: string;
  fullName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  prescriptionDate?: string;
  dateOfInstruction?: string;
  dateOfAccident?: string;
  status?: string;
  fileType?: string;
  ownerId: string
}
