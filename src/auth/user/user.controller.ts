import { Body, Controller, Delete, Get, HttpCode, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/types/auth.dto';
import { UserService } from './user.service';
import { Public } from '../public.decorator';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }
    @Public()
    @Post('/register')
    addUser(@Body() data: RegisterDto) {
        return this.userService.addUser(data);
    }

    @Public()
    @Post('/login')
    login(@Body() loginData: LoginDto) {
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
    @Get('/profile')
    async getProfile(@Req() req) {
        const user = await req?.user
        return this.userService.getProfile(user?.userId)
    }
}
