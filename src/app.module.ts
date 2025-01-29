import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET,JWT_EXPIRES_IN } from 'constant';
console.log("🚀 ~ JWT_EXPIRES_IN:", JWT_EXPIRES_IN)
console.log("🚀 ~ JWT_SECRET:", JWT_SECRET)

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available globally
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_URL'),
        dbName: 'nextjs-auth',
      }),
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<any>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<any>('JWT_EXPIRATION'),
          },
        };
      },
    }),
    // JwtModule.register({
    //   secret: JWT_SECRET,
    //   signOptions: {
    //     expiresIn: JWT_EXPIRES_IN,
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
