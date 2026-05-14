/* eslint-disable prettier/prettier */

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';

import { Role } from '../entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async create(userData: Partial<User>) {
    const existingUser =
      await this.usersRepository.findOne({
        where: {
          email: userData.email,
        },
      });

    if (existingUser) {
      throw new ConflictException(
        'Email ya registrado',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        userData.password!,
        10,
      );

    const user =
      this.usersRepository.create({
        ...userData,

        password: hashedPassword,
      });

    return await this.usersRepository.save(
      user,
    );
  }

  async findAll() {
    return await this.usersRepository.find({
      relations: ['roles'],
    });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: {
        email,
      },

      relations: ['roles'],
    });
  }

  async assignRoles(
    userId: string,
    roleNames: string[],
  ) {
    const user =
      await this.usersRepository.findOne({
        where: {
          id: userId,
        },

        relations: ['roles'],
      });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    const roles =
      await this.rolesRepository
        .createQueryBuilder('role')
        .where(
          'role.role_name IN (:...roleNames)',
          {
            roleNames,
          },
        )
        .getMany();

    user.roles = roles;

    await this.usersRepository.save(user);

    return {
      message: 'Roles asignados',
    };
  }
}