import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { User, userSchema } from 'src/models/user.models';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AuthModule {}
