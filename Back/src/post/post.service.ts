import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private postModel: Model<Post>,
  ) { }

  async createPost(data: {
    idUser: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    username: string;
    content: string;
    image?: string;
  }) {
    try {
      if (!data.idUser) {
        throw new BadRequestException('El id del usuario es obligatorio');
      }

      const newPost = new this.postModel({
        idUser: data.idUser,
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: data.profileImage,
        username: data.username,
        content: data.content,
        image: data.image,
        likes: [],
        comments: [],
        date: new Date(),
        show: true,
      });

      return await newPost.save();
    } catch (error) {
      console.error('Error al crear el post:', error);
      throw new InternalServerErrorException('No se pudo crear el post');
    }
  }

  async findAll(isAdmin: string): Promise<Post[]> {
    try {
      const filter = isAdmin === 'true' ? {} : { show: true };

      const posts = await this.postModel
        .find(filter)
        .sort({ date: -1 })
        .exec();

      return posts;
    } catch (error) {
      console.error('Error al obtener todos los posts:', error);
      throw new InternalServerErrorException('Error al obtener todos los posts');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
