export interface ResponseStatus {
  success: boolean;
  message: string;
  data?: object;
}

export enum IPlanCategory {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
}
