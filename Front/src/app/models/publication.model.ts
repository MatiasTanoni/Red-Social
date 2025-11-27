export interface Comment {
    _id?: string;
    idUser: string;
    username: string;
    firstName: string;
    lastName: string;
    image_url: string;
    content: string;
    edited?: boolean;
    show: boolean;
    date: Date;
    text: string;
}

export interface Publication {
    _id: string;
    idUser: string;
    firstName: string;
    lastName: string;
    image_url: string;
    username: string;
    content: string;
    date: Date;
    likes: string[];
    imagePost?: string;
    comments: Comment[];
    show: boolean;
}
