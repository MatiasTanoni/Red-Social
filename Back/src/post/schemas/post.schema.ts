import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class Post extends Document {
    @Prop() idUser: string;
    @Prop() firstName: string;
    @Prop() lastName: string;
    @Prop() profileImage: string;
    @Prop({ required: true }) username: string;
    @Prop() content: string;
    @Prop() image?: string;

    @Prop({
        type: [{
            idUser: String,
            username: String,
            firstName: String,
            lastName: String,
            profileImage: String
        }],
        default: [],
    })
    likes: {
        idUser: string;
        username: string;
        firstName: string;
        lastName: string;
        profileImage: string;
    }[];

    @Prop({
        type: [{
            idUser: String,
            username: String,
            firstName: String,
            lastName: String,
            profileImage: String,
            content: String,
            edited: Boolean,
            show: Boolean,
            date: Date
        }],
        default: [],
    })
    comments: {
        _id: any;
        idUser: string;
        username: string;
        firstName: string;
        lastName: string;
        profileImage: string;
        content: string;
        edited: boolean;
        show: boolean;
        date: Date;
    }[];

    @Prop({ default: Date.now })
    date: Date;

    @Prop({ default: true })
    show: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
