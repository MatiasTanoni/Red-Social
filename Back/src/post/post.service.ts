import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
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
