import { Controller, Get, Post, Body, Patch, Param, Delete, Query, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post('create')
  // @UseInterceptors(FileInterceptor('image'))
  async createPost(
    // @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    try {
      // let image: string | undefined;

      if (!createPostDto.idUser) {
        throw new BadRequestException('El id del usuario es obligatorio');
      }

      // if (file) {
      //   try {
      //     const imageUploadResult = await this.cloudinaryService.uploadImageFromBuffer(file);
      //     image = imageUploadResult.secure_url;
      //   } catch (err) {
      //     console.error('Error subiendo imagen a Cloudinary:', err);
      //     throw new InternalServerErrorException('Error al subir la imagen');
      //   }
      // }

      const newPost = await this.postService.createPost({
        ...createPostDto,
        // image,
      });

      return newPost;

    } catch (error) {
      console.error('Error en el controlador createPost:', error);
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al crear el post');
    }
  }

  @Get('/all')
  findAll(@Query('isAdmin') isAdmin: string) {
    return this.postService.findAll(isAdmin);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
