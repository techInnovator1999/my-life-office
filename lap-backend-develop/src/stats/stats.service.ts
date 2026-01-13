import { JwtPayloadType } from '@/auth/strategies/types/jwt-payload.type';
import { StripeService } from '@/stripe/stripe.service';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { StatsDto } from './dto/stats.dto';

@Injectable()
export class StatsService {
  constructor(
    private stripeService: StripeService,
    private readonly usersService: UsersService,
  ) {}

  async getAllStats(userJwtPayload: JwtPayloadType): Promise<StatsDto> {
    const role = userJwtPayload.role?.id;
    const user = userJwtPayload.id;
    try {
      // Concurrently fetch data from multiple services for efficiency
      const [
        totalAmount,
        countTotalRegisteredUsers,
        countEarningCurrentWeek,
        countBlockedUsers,
        countAccountManagerStasuses,
        countTotalRegisteredClients,
        countAbandonedClients,
        countActiveClients,
      ] = await Promise.all([
        this.stripeService.retrievePaymentDetails(),
        this.usersService.countTotalRegisteredUsers(),
        this.stripeService.countEarningCurrentWeek(),
        this.usersService.countBlockedUsers(role, user),
        this.usersService.countAccountManagerStasuses(),
        this.usersService.countTotalRegisteredClients(role, user),
        this.usersService.countAbandonedClients(role, user),
        this.usersService.countActiveClients(role, user),
      ]);
      return {
        total_amount_captured: totalAmount.totalAmount,
        total_registered_users: countTotalRegisteredUsers.count,
        count_earning_current_week: countEarningCurrentWeek.count,
        count_blocked_users: countBlockedUsers.count,
        count_account_manager_statuses: countAccountManagerStasuses,
        total_registered_clients: countTotalRegisteredClients.count,
        total_abandoned_clients: countAbandonedClients.count,
        total_active_clients: countActiveClients.count,
      };
    } catch {
      throw new Error(
        'An error occurred while retrieving stats. Please try again later.',
      );
    }
  }
}
