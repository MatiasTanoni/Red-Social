import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { ForbiddenException } from '@nestjs/common';
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
        image_url: string;
        username: string;
        content: string;
        imagePost: string;
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
                image_url: data.image_url,
                username: data.username,
                content: data.content,
                imagePost: data.imagePost,
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
    ): Promise<any[]> {
        try {
            // Fix: convertir query params a número
            page = Number(page);
            limit = Number(limit);
            const skip = (page - 1) * limit;

            const filter = isAdmin === 'true' ? {} : { show: true };

            if (orderBy === 'fecha') {
                return await this.postModel
                    .find(filter)
                    .sort({ date: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec();
            }

            // Ordenar por cantidad de likes
            return await this.postModel.aggregate([
                { $match: filter },
                {
                    $addFields: {
                        likesCount: { $size: { $ifNull: ['$likes', []] } }
                    }
                },
                { $sort: { likesCount: -1, date: -1 } },
                { $skip: skip },
                { $limit: limit },
            ]).exec();

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
                .sort({ date: -1 })   // Orden descendente (últimos primero)
                .limit(3)             // SOLO 3 posts
                .lean();

            console.log('Posts encontrados:', posts.length);

            return posts;

        } catch (error) {
            console.error('Error en findByUser:', error);
            throw new InternalServerErrorException('No se pudieron obtener los posts');
        }
    }

    async toggleLike(id: number, idUser: string): Promise<Post> {
        console.log('toggleLike recibido en el servicio:', id, idUser);
        try {
            const post = await this.postModel.findById(id).exec();
            if (!post) {
                throw new NotFoundException('No se pudo encontrar el post');
            }
            if (post.likes.includes(idUser)) {
                post.likes = post.likes.filter(like => like !== idUser);
                await post.save();
                return post;
            }
            post.likes.push(idUser);
            await post.save();
            return post;
        } catch (error) {
            console.error('Error en toggleLike:', error);
            throw new InternalServerErrorException('Error al cambiar el like');
        }
    }
}