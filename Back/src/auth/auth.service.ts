import { Injectable } from '@nestjs/common';
import { NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-auth.dto';
import { Model } from 'mongoose';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<CreateUserDto>,
  ) { }

  async create(userData: any): Promise<any> {
    console.log('CREATING USER IN AUTH SERVICE:', userData);
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);
    userData.email = userData.email.toLocaleLowerCase();
    userData.username = userData.username.toLocaleLowerCase();

    const newUser = new this.userModel({
      ...userData,
      show: true,
      password: hashedPassword
    });
    console.log('NEW USER:', newUser);
    return newUser.save();
  }

  async login(usernameOrEmail: string, password: string): Promise<{ id: Object; username: string; perfil: string; name: string; lastName: string, birthDate: string; description: string, email: string, profileImage: string, createdAt: Date, show: boolean }> {
    const user = await this.userModel.findOne({
      $or: [{ email: usernameOrEmail.toLocaleLowerCase() }, { username: usernameOrEmail.toLocaleLowerCase() }]
    }).exec();

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    if (!user.show) {
      throw new ForbiddenException('El usuario existe pero no está disponible');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña no es correcta');
    }

    // const payload = {
    //   sub: user._id,
    //   username: user.username,
    //   email: user.email,
    // };

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      perfil: user.perfil,
      birthDate: user.birthDate,
      description: user.description || "",
      profileImage: user.profileImage || "",
      createdAt: user.createdAt,
      show: user.show
    };
  }


  async findOneByEmail(email: string): Promise<CreateUserDto | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOneByUsername(username: string): Promise<CreateUserDto | null> {
    return this.userModel.findOne({ username }).exec();
  }
}
