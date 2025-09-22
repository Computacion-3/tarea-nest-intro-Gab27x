import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GamesService {

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly userService: UsersService
  ){}

  async create(createGameDto: CreateGameDto): Promise<Game | null> {
    const user = await this.userService.findOne(createGameDto.userId)
    
    if (!user){
      return null
    }

    const newGame = this.gameRepository.create(createGameDto)

    newGame.user = user
    return await this.gameRepository.save(newGame)
  }

  async  findAll(): Promise<Game[]> {
 
    return await this.gameRepository.find()
  }

  async  findOne(id: number): Promise<Game | null>{
    return await this.gameRepository.findOneBy({id})
  }

  async  update(id: number, updateGameDto: UpdateGameDto) {
    
    await this.gameRepository.update(id,updateGameDto) 
    return  this.findOne(id)
  }

  async  remove(id: number) {
    const result = await this.gameRepository.delete(id)
    if(result.affected){
      return {id}
    }
    return null
  }
}
