import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StatsDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_registered_users?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_registered_clients?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_abandoned_clients?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_active_clients?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_amount_captured?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_interviewed_users?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_onboarded_users?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_registered_users_more_than_sixty_days?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_registered_users_less_than_sixty_days?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_users_amount_paid?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_users_with_one_step_completed?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_users_with_incomplete_questionnaire?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_users_with_complete_questionnaire_no_checkout?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_users_registered_not_onboarded?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  total_users_with_onboarded_no_questionnaire?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  count_pending_order_with_unpaid_status?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  count_pending_order_with_paid_status?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  count_open_ticket?: number | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  count_earning_current_week?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  count_order_stasuses?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  count_users_paid_processing?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  count_users_abandoned_pay?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  count_users_archived?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  count_users_paid_pending?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  count_active_users?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  count_blocked_users?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  count_partner_statuses?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  count_account_manager_statuses?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  count_precheckout_questionnaires?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  count_postcheckout_questionnaires?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  total_questionnaires?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  total_active_promo_codes?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  total_expired_promo_codes?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  total_open_support_statuses?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  total_inprocess_support_statuses?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  total_resolved_support_statuses?: number | null;
}
