export enum FilterUserEnum {
  'REGISTERED_USERS_LESS_THAN_SIXTY_DAYS' = '1',
  'ONBOARDED_USERS' = '2',
  'INTERVIEWED_USERS' = '3',
  'AMOUNT_PAID_USERS' = '4',
  'REGISTERED_USERS_MORE_THAN_SIXTY_DAYS' = '5',
  'ONLY_ONE_STEP_COMPLETED' = '6',
  'INCOMPLETE_QUESTIONS' = '7',
  'COMPLETED_QUESTIONS_WITHOUT_CHECKOUT' = '8',
  'REGISTERED_USER_BUT_NOT_ONBOARDED' = '9',
  'TOTAL_REGISTERED_USERS' = '10',
  'ONBOARDED_BUT_NOT_INTERVIEWED' = '11',
  'PAID_PENDING' = '12', // pipeline
  'PAID_PROCESSING' = '13', // delivered
  'ABANDONED_USERS' = '14',
  'ARCHIVED_USERS' = '15',
  'ACTIVE_USERS' = '16',
  'SUSPEND_USERS' = '17',
}

export enum UserDeviceLanguageEnum {
  'en' = 1,
}

export enum PartnerStatusEnum {
  'REGISTERED' = 'Registered',
  'WAITING_APPROVAL' = 'Waiting Approval',
  'APPROVED' = 'Approved',
  'REJECTED' = 'Rejected',
  'ARCHIVED' = 'Archived',
}

export enum AccountManagerStatusEnum {
  'INVITED' = 'Invited',
  'ACTIVE' = 'Active',
  'ARCHIVED' = 'Archived',
}

export enum HeardByEnum {
  'MY_AGENT_ADVISOR' = 'My Agent/Advisor',
  'FRIENDS_RELATIVE' = 'My relative or friend',
  'EMAIL' = 'Email',
  'GOOGLE' = 'Google',
  'FACEBOOK' = 'Facebook',
  'INSTAGRAM' = 'Instagram',
  'LINKEDIN' = 'LinkedIn',
  'TIKTOK' = 'TikTok',
  'OTHERS' = 'Other',
}
