import { Body, Controller, Delete, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/types/auth.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../auth.guard';

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
        @Delete('/delete')
        deleteUser(@Query('id') id: string) {
            return this.userService.deleteUser(id);
        }
        
        @Get('/all')
        getAllUsers() {
            return this.userService.getAllUsers();
        }
}
