/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.input';
import { JwtPayload } from 'src/auth/dto/jwt-payload.interface';
// import { GraphQLForbiddenException } from 'src/common/exceptions/custom-exceptions';
// import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // console.log(username, password);
    const user = await this.usersService.findOne(username);
    // console.log(user);
    if (user && (await user.validatePassword(password))) {
      console.log('suceeedddd');
      const { password, ...result } = user;
      return result;
    }
    console.log('faileeed');

    return null;
  }

  async login(loginInput: LoginInput) {
    // Validate user credentials
    const user = await this.validateUser(
      loginInput.username,
      loginInput.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
      //   throw new GraphQLForbiddenException('Invalid Credential------');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }
}
