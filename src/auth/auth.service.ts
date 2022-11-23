import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './../users/users.service';
import { UserInput } from './dto/user.input';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,

    ) { }

    async validate(username: string, pass: string): Promise<any> {
        const user = this.usersService.findOne(username);
        const { password, ...result } = user;
        const match = await bcrypt.compare(pass, user?.password);
        if (user && match) {
            return result;
        }
        return null;
    }

    async login(loginUserInput: UserInput) {
        const user = this.usersService.findOne(loginUserInput.username);
        return {
            access_token: this.jwtService.sign({ username: user.username, sub: user.id }),
            user
        };
    }

    async signup(signupUserInput: UserInput) {
        const user = this.usersService.findOne(signupUserInput.username);
        if (user) {
            throw new BadRequestException('User is already exists');
        }
        const password = await bcrypt.hash(signupUserInput.password, 10);
        return this.usersService.create({
            ...signupUserInput,
            password
        });
    }
}
