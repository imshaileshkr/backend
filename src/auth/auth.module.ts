import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/models/user.models';

import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        async useFactory() {
          const schema = userSchema
          schema.pre('save', async function (next) {
            if (this.isModified('password')) {
              this.password = await bcrypt.hash(this.password, 10)
            }
            next()
          })

          return schema

        }
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class AuthModule {}
