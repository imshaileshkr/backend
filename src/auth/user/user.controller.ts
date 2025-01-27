import { Body, Controller, Get, Post } from '@nestjs/common';
import { Register } from 'src/types/auth.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}
    
    @Get('/profile')
    getProfile() {
        return 'profile';
    }

    @Post('/register')
        addUser(@Body() data:Register) {
            return this.userService.addUser(data);
        }
}
