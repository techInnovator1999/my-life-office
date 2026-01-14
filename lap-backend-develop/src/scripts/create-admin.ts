/**
 * Script to create admin user: admin@mylifeoffice.com
 * Run with: npm run create:admin
 */

import { NestFactory } from '@nestjs/core';
import { SeedModule } from '../database/seeds/relational/seed.module';
import { UserSeedModule } from '../database/seeds/relational/user/user-seed.module';
import { UserSeedService } from '../database/seeds/relational/user/user-seed.service';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const ADMIN_EMAIL = 'admin@mylifeoffice.com';
const ADMIN_PASSWORD = 'secret'; // This is the password for login
const ADMIN_FIRST_NAME = 'Admin';
const ADMIN_LAST_NAME = 'MyLifeOffice';

async function createAdminUser() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  try {
    const userRepository = app.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: ADMIN_EMAIL },
    });

    if (existingUser) {
      console.log(`\n⚠️  User ${ADMIN_EMAIL} already exists!`);
      console.log(`User ID: ${existingUser.id}`);
      await app.close();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create admin user
    const adminUser = userRepository.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      role: {
        id: RoleEnum.ADMIN,
      },
      status: {
        id: StatusEnum.ACTIVE,
      },
      isApproved: true,
      crmAgent: false, // Admin user is not a CRM agent
    });

    const savedUser = await userRepository.save(adminUser);

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log(`Name: ${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`);
    console.log(`User ID: ${savedUser.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await app.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    await app.close();
    process.exit(1);
  }
}

createAdminUser();

