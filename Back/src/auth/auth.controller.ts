import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    console.log('BACK:', createUserDto);
    const existingEmail = await this.authService.findOneByEmail(createUserDto.email);
    const existingUsername = await this.authService.findOneByUsername(createUserDto.username);

    console.log('EXISTING EMAIL', existingEmail);
    console.log('EXISTING USERNAME', existingUsername);
    if (existingEmail) {
      throw new BadRequestException('El email ya está registrado');
    }

    if (existingUsername) {
      throw new BadRequestException('El nombre de usuario ya está registrado');
    }

    // if (file) {
    //   // const imageUploadResult = await this.cloudinaryService.uploadImageFromBuffer(file);
    //   // createUserDto.profileImage = imageUploadResult.secure_url;
    // }
    console.log('createUserDto', createUserDto);

    const user = await this.authService.create(createUserDto);
    console.log('USER', user);
    return { success: true, message: 'Usuario registrado exitosamente', user };
  }

  @Post('login')
  async login(
    @Body() body: { usernameOrEmail: string; password: string }
  ): Promise<{}> {
    return await this.authService.login(body.usernameOrEmail, body.password);
  }

}
