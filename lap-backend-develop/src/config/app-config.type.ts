export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  frontendClientDomain?: string;
  frontendPartnerDomain?: string;
  devEnv?: string;
  backendDomain: string;
  frontendAdminDomain?: string;
  lapSupport?: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
};
