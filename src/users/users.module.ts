import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from 'src/roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [RolesModule, TypeOrmModule.forFeature([User])],
})
export class UsersModule {}