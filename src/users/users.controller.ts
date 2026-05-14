/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { RolesGuard } from '../guards/roles.guard';

import { Roles } from '../decorators/roles.decorator';

import { AssignRoleDto } from '../dto/assign-role.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('admin')
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('admin')
  @Patch(':id/roles')
  async assignRoles(
    @Param('id') id: string,

    @Body() assignRoleDto: AssignRoleDto,
  ) {
    return await this.usersService.assignRoles(
      id,
      assignRoleDto.roles,
    );
  }
}