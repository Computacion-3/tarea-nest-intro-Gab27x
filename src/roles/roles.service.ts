import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { AddPermissionDto } from './dto/add-permision.dto';
import { Permission } from 'src/permissions/entities/permission.entity';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly permissionService: PermissionsService
    ) {}

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const newRole = this.roleRepository.create(createRoleDto);
        return await this.roleRepository.save(newRole);
    }

    async findAll(): Promise<Role[]> {
        return await this.roleRepository.find();
    }

    async findOne(id: number): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ id });
    }

    async update(
        id: number,
        updateRoleDto: UpdateRoleDto,
    ): Promise<Role | null> {
        await this.roleRepository.update(id, updateRoleDto);
        return await this.roleRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<{ id: number } | null> {
        const result = await this.roleRepository.delete(id);
        if (result.affected) {
            return { id };
        }
        return null;
    }

    async findByName(name: string): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ name });
    }

   async addPermissions(id: number,addPermissionDto: AddPermissionDto): Promise<boolean | boolean[]> {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['permissions'],
        });

        if (!role) {
            return false;
        }

        const result: boolean[] = [];

        for (const permissionId of addPermissionDto.permissionsIds) {
            const added = await this.addPermission(role, permissionId);
            result.push(added);
        }

        return result
    }


   async addPermission(role:Role,id: number): Promise<boolean>{
        const permision: Permission | null = await this.permissionService.findOne(id)

        if(!permision){
            return false
        }else{

            role.permissions.push(permision)
            await this.roleRepository.save(role)
            return true
        }

   }
    async removePermission(roleId: number, permissionId: number): Promise<boolean> {
    const role = await this.roleRepository.findOne({
        where: { id: roleId },
        relations: ['permissions'],
    });

    if (!role) return false;

    const index = role.permissions.findIndex(p => p.id === permissionId);

    if (index === -1) return false; // Permiso no encontrado en el rol

    role.permissions.splice(index, 1); // eliminar permiso del array

    await this.roleRepository.save(role); // persistir cambios

    return true;
    }

}