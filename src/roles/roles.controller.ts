/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RolesService } from './roles.service';

import { CreateRoleDto } from '../dto/create-role.dto';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { RolesGuard } from '../guards/roles.guard';

import { Roles } from '../decorators/roles.decorator';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ) {}

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('admin')
  @Post()
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ) {
    const role =
      await this.rolesService.create(
        createRoleDto,
      );

    return {
      message: 'Rol creado con éxito',

      roleId: role.id,
    };
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('admin')
  @Get()
  async findAll() {
    return await this.rolesService.findAll();
  }
}