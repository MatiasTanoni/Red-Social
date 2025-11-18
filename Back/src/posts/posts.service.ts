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

            console.log('createPostDto recibido en el servicio:', data);
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
                // likes: [],
                // comments: [],
                date: new Date(),
                show: true,
            });
            console.log('newPost', newPost);
            return await newPost.save();
        } catch (error) {
            console.error('Error al crear el post:', error);
            throw new InternalServerErrorException('No se pudo crear el post');
        }
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        orderBy: 'fecha' | 'likes' = 'fecha',
        isAdmin: string,
    ): Promise<Post[]> {
        try {

            const filter = isAdmin === 'true' ? {} : { show: true };

            const sort: any = {};
            if (orderBy === 'fecha') sort.date = -1;
            if (orderBy === 'likes') sort.likes = -1;

            const posts = await this.postModel
                .find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();

            return posts;

        } catch (error) {
            console.error('Error al obtener posts:', error);
            throw new InternalServerErrorException('Error al obtener los posts');
        }
    }

    async findByUser(userId: string) {
        try {
            console.log('Buscando posts de:', userId);

            const posts = await this.postModel
                .find({ idUser: userId, show: true })
                .sort({ date: -1 })
                .lean();

            console.log('Posts encontrados:', posts.length);

            return posts;

        } catch (error) {
            console.error('Error en findByUser:', error);
            throw new InternalServerErrorException('No se pudieron obtener los posts');
        }
    }

}