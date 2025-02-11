import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>
@Schema({ timestamps: true })
export class User {
    @Prop({
        isRequired: true,
        trim: true,
    })
    name: string;

    @Prop({
        isRequired: true,
        trim: true,
        unique: true,
        lowercase: true,
    })
    email: string;

    @Prop({
        isRequired: true,
        trim: true,
    })
    password: string;
}


export const userSchema =  SchemaFactory.createForClass(User);

userSchema.pre('save', async function (next) {
    const user = this as any; // Explicitly typing `this`
    
    if (user.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });