import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/models/user.models';
import { LoginDto, RegisterDto } from 'src/types/auth.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {


    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {
    }


    async addUser(data: RegisterDto) {
        const user = await this.userModel.findOne({ email: data.email.toLowerCase() })
        if (user) {
            throw new BadRequestException('User already exists')
        }
        const userData = await this.userModel.create({
            email: data.email,
            name: data.username,
            password: data.password
        })

        const token = this.jwtService.sign({ userId: userData._id })
        return {
            message: 'user created',
            user: {
                email: userData.email,
                name: userData.name,
            },
            access_token: token,
        };
    }

    async login(data: LoginDto) {
        const user = await this.userModel.findOne({ email: data.email.toLowerCase() })
        if (!user) {
            throw new BadRequestException('User not found')
        }
        const isMatch = await bcrypt.compare(data.password, user.password)
        if (!isMatch) {
            throw new BadRequestException('invalid credentials')
        }
        const token = this.jwtService.sign({ userId: user._id })
        return {
            message: 'User logged in successfully',
            user: {
                email: user.email,
                name: user.name
            },
            access_token: token
        }
    }


    async getProfile(userId: string) {
        if (!userId) throw new UnauthorizedException('Unauthorized access')
        const user = await this.userModel.findById(userId).select(['-password', '-__v']).lean()
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            message: 'User profile fetched successfully',
            data: user
        }
    }

    async getAllUsers() {
        const users = await this.userModel.find().select(['-password', '-__v']).lean()
        return {
            message: 'Users fetched successfully',
            data: users
        }
    }

    async deleteUser(id: string) {
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
