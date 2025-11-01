export enum SubmissionStatus {
  Idle = 'IDLE',
  Submitting = 'SUBMITTING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

export interface GHLFormData {
  fullName: string;
  email: string;
  phone: string;
}