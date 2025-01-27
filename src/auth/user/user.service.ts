import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.models';
import { LoginDto, RegisterDto } from 'src/types/auth.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

    constructor( @InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {
        console.log('JwtService is initialized:', this.jwtService);
    }
    async addUser(data: RegisterDto) {
        const user = await this.userModel.findOne({ email: data.email.toLowerCase() })
        if (user) {
            throw new BadRequestException('user already exists')
        }
        const userData = await this.userModel.create({
            email: data.email,
            name: data.username,
            password: data.password
        })

        const token =  this.jwtService.sign({ userId: userData._id })
        return {
            message: 'user created',
            data: userData,
            token: token
        }
    }

    async login(data: LoginDto){
      const user = await this.userModel.findOne({ email: data.email.toLowerCase() })
      if (!user) {
          throw new BadRequestException('user not found')
      }
      const isMatch = await bcrypt.compare(data.password, user.password)
      if (!isMatch) {
          throw new BadRequestException('invalid credentials')
      }
      return {
          message: 'user logged in successfully',
          "token": "token"
      }
    }
}
