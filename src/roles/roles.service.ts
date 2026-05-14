/* eslint-disable prettier/prettier */

import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async create(roleData: Partial<Role>) {
    const existingRole =
      await this.rolesRepository.findOne({
        where: {
          role_name: roleData.role_name,
        },
      });

    if (existingRole) {
      throw new ConflictException(
        'role_name ya existe',
      );
    }

    const role =
      this.rolesRepository.create(roleData);

    return await this.rolesRepository.save(
      role,
    );
  }

  async findAll() {
    return await this.rolesRepository.find();
  }

  async findByNames(roleNames: string[]) {
    return await this.rolesRepository
      .createQueryBuilder('role')
      .where(
        'role.role_name IN (:...roleNames)',
        {
          roleNames,
        },
      )
      .getMany();
  }
}