import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }
  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage'))
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const existingEmail = await this.authService.findOneByEmail(createUserDto.email);
    const existingUsername = await this.authService.findOneByUsername(createUserDto.username);

    if (existingEmail) {
      throw new BadRequestException('El email ya está registrado');
    }

    if (existingUsername) {
      throw new BadRequestException('El nombre de usuario ya está registrado');
    }

    if (file) {
      // const imageUploadResult = await this.cloudinaryService.uploadImageFromBuffer(file);
      // createUserDto.profileImage = imageUploadResult.secure_url;
    }

    const user = await this.authService.create(createUserDto);
    return user;
  }

  @Post('login')
  async login(
    @Body() body: { usernameOrEmail: string; password: string }
  ): Promise<{ accessToken: string }> {
    return await this.authService.login(body.usernameOrEmail, body.password);
  }

  // @Get()
  // async list(): Promise<any[]> {
  //   // return this.authService.findAll();
  // }
}
