import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/types/auth.dto';
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
        addUser(@Body() data:RegisterDto) {
            return this.userService.addUser(data);
        }

        @Post('/login')
        login(@Body() loginData:LoginDto){
            return this.userService.login(loginData)
        }
}
