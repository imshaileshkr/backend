import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/models/user.models';
import { LoginDto, RegisterDto } from 'src/types/auth.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'constant';

@Injectable()
export class UserService {
    async getAllUsers() {
        const users = await this.userModel.find();
        return {
            message: 'users fetched successfully',
            data: users
        }
    }


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
      const token =  this.jwtService.sign({ userId: user._id },{
        secret:JWT_SECRET,
        expiresIn: '7d'
    })
      return {
          message: 'User logged in successfully',
          "token": token
      }
    }

    async deleteUser(id: string) {
        console.log("🚀 ~ UserService ~ deleteUser ~ id:", id);
    
        // Validate the ID format (MongoDB ObjectId validation)
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid user ID format');
        }
    
        // Use `findByIdAndDelete` directly and check if user existed
        const user = await this.userModel.findByIdAndDelete(id);
        
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        return { message: 'User deleted successfully' };
    }
    
}
