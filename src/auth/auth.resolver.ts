import { User } from 'src/users/entities/user.entity';
import { GqlAuthGuard } from './gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response-dto';
import { UserInput } from './dto/user.input';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Mutation(() => LoginResponse)
    @UseGuards(GqlAuthGuard)
    login(@Args('loginUserInput') loginUserInput: UserInput, @Context() context) {
        return this.authService.login(context.user);
    }

    @Mutation(() => User, { name: 'signup' })
    signup(@Args('signupUserInput') signupUserInput: UserInput) {
        return this.authService.signup(signupUserInput);
    }
}
