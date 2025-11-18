import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';

import { Model } from 'mongoose';
import { Types } from 'mongoose';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel('Post') private postModel: Model<Post>,
    ) { }

    async createPost(data: {
        idUser: string;
        firstName: string;
        lastName: string;
        // profileImage: string;
        username: string;
        content: string;
        // image?: string;
    }) {
        try {
            if (!data.idUser) {
                throw new BadRequestException('El id del usuario es obligatorio');
            }

            const newPost = new this.postModel({
                idUser: data.idUser,
                firstName: data.firstName,
                lastName: data.lastName,
                // profileImage: data.profileImage,
                username: data.username,
                content: data.content,
                // image: data.image,
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

}
