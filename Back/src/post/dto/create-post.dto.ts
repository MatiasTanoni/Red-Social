export class CreatePostDto {
    idUser: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    username: string;
    content: string;
    image?: string;
    date?: Date | string;

}
