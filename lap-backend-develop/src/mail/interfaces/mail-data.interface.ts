export interface MailData<T = never> {
  to: string;
  cc?: string;
  data: T;
}
