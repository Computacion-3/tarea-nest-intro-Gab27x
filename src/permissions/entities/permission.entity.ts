import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('permissions')
export class Permission {

	@PrimaryGeneratedColumn()
	id: number

	@Column({unique: true})
	name: string	
	
	@Column({nullable: true})
	description: string



}
