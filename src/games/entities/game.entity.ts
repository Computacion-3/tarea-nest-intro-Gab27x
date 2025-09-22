import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('games')
export class Game {

	@PrimaryGeneratedColumn()
	id: number
	@Column({nullable: false})
	name: string

	@Column({nullable: false, default: 0})
	bestScore: number
	
	@ManyToOne(()=> User, (user) => user.games , {eager: true} )
	@JoinColumn({name: 'user_id'})
	user: User
	

}
