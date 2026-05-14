/* eslint-disable prettier/prettier */

import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

import { UsersService } from '../users/users.service';

import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email ya registrado');
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      10,
    );

    const newUser = await this.usersService.create({
      email: registerDto.email,

      password: hashedPassword,

      name: registerDto.name,

      phone: registerDto.phone,
    });

    return {
      message: 'Usuario registrado con éxito',

      userId: newUser.id,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.email = :email', {
        email: loginDto.email,
      })
      .getOne();

    if (!user) {
      throw new UnauthorizedException(
        'Credenciales incorrectas',
      );
    }

    if (!user.is_active) {
      throw new ForbiddenException(
        'Usuario desactivado',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Credenciales incorrectas',
      );
    }

    const payload = {
      sub: user.id,

      email: user.email,

      roles:
        user.roles?.map(
          (role) => role.role_name,
        ) || [],
    };

    const access_token =
      await this.jwtService.signAsync(payload);

    return {
      access_token,
    };
  }
}