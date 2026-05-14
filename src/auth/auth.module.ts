/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { UsersModule } from '../users/users.module';

import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,

    PassportModule,

    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: 'super_secret',

      signOptions: {
        expiresIn: '120s',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [AuthService],
})
export class AuthModule {}