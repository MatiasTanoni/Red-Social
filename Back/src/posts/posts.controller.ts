import {
    Controller,
    Post,
    Put,
    UploadedFile,
    UseInterceptors,
    Body,
    BadRequestException,
    InternalServerErrorException,
    Query,
    Param,
    Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreatePostDto } from './dto/create-post.dto';
// import { CreateLikeDto } from './dto/create-like.dto';
// import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        // private readonly cloudinaryService: CloudinaryService,
    ) { }

    @Post('createPost')
    async createPost(
        @Body() data: { idUser: string; firstName: string; lastName: string; username: string; content: string; },
    ) {
        try {
            console.log('createPostDto recibido en el controlador:', data);
            // let image: string | undefined;

            if (!data.idUser) {
                throw new BadRequestException('El id del usuario es obligatorio');
            }

            // if (file) {
            //     try {
            //         const imageUploadResult = await this.cloudinaryService.uploadImageFromBuffer(file);
            //         image = imageUploadResult.secure_url;
            //     } catch (err) {
            //         console.error('Error subiendo imagen a Cloudinary:', err);
            //         throw new InternalServerErrorException('Error al subir la imagen');
            //     }
            // }

            const newPost = await this.postsService.createPost({
                ...data,
                // image,
            });

            return data;

        } catch (error) {
            console.error('Error en el controlador createPost:', error);
            if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException('Error interno al crear el post');
        }
    }

    @Get('/all')
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('orderBy') orderBy: 'fecha' | 'likes' = 'fecha',
        @Query('isAdmin') isAdmin: string
    ) {
        return this.postsService.findAll(page, limit, orderBy, isAdmin);
    }

    @Get('user/:id')
    async getByUser(@Param('id') userId: string) {
        console.log('getByUser', userId);
        return this.postsService.findByUser(userId);
    }

}