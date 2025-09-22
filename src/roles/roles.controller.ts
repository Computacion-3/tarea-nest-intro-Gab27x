import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpCode } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AddPermissionDto } from './dto/add-permision.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  @Post(':id')
  async addPermission(
    @Param('id') id: string,
    @Body() addPermissionDto: AddPermissionDto,
  ) {
    const result = await this.rolesService.addPermissions(+id, addPermissionDto);

    if (result === false) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    if (Array.isArray(result) && result.every(r => r === false)) {
      throw new NotFoundException(`No permissions were added to role ${id}, no permissions found`);
    }


    return result;
  }

  @Delete(':roleId/permissions/:permissionId')
  @HttpCode(204)
  async removePermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    const result = await this.rolesService.removePermission(+roleId, +permissionId);

    if (!result) {
      throw new NotFoundException(
        `Role ${roleId} or Permission ${permissionId} not found or not assigned`,
      );
    }

  }

}
