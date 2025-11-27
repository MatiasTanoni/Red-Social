import { Injectable } from '@nestjs/common';
import { NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-auth.dto';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<CreateUserDto>,
    private jwtService: JwtService
  ) { }

  // REGISTRO
  async create(userData: any): Promise<any> {
    console.log('CREATING USER IN AUTH SERVICE:', userData);
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);
    userData.email = userData.email.toLowerCase();
    userData.username = userData.username.toLowerCase();

    const newUser = new this.userModel({
      ...userData,
      show: true,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    const payload = {
      sub: savedUser._id,
      username: savedUser.username,
      email: savedUser.email
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      name: savedUser.name,
      lastName: savedUser.lastName,
      birthDate: savedUser.birthDate,
      description: savedUser.description || "",
      image_url: savedUser.image_url || "",
      show: savedUser.show,
      admin : savedUser.admin
    };
  }

  // LOGIN
  async login(usernameOrEmail: string, password: string) {
    const user = await this.userModel.findOne({
      $or: [
        { email: usernameOrEmail.toLowerCase() },
        { username: usernameOrEmail.toLowerCase() }
      ]
    }).exec();

    if (!user) throw new NotFoundException('El usuario no existe');
    if (!user.show) throw new ForbiddenException('El usuario existe pero no está disponible');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('La contraseña no es correcta');

    const payload = {
      sub: user._id,
      username: user.username,
      email: user.email
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      birthDate: user.birthDate,
      description: user.description || "",
      image_url: user.image_url || "",
      show: user.show,
      admin : user.admin
    };
  }

  async findOneByEmail(email: string): Promise<CreateUserDto | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOneByUsername(username: string): Promise<CreateUserDto | null> {
    return this.userModel.findOne({ username }).exec();
  }
}
