import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.models';
import { Register } from 'src/types/auth.dto';

@Injectable()
export class UserService {

    constructor( @InjectModel(User.name) private userModel: Model<User>) { }
    async addUser(data: Register) {
        const user = await this.userModel.findOne({ email: data.email.toLowerCase() })
        if (user) {
            throw new BadRequestException('user already exists')
            return
        }
        this.userModel.create({
            email: data.email,
            name: data.username,
            password: data.password
        })
        return {
            message: 'user created',
            "token": "token"
        }
    }
}
