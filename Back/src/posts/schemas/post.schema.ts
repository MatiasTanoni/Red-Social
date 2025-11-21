import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Post extends Document {
    @Prop() idUser: string;
    @Prop() firstName: string;
    @Prop() lastName: string;
    @Prop() image_url: string;
    @Prop({ required: true }) username: string;
    @Prop() content: string;
    @Prop() likes: Array<string>;
    @Prop() imagePost: string;

    @Prop({
        type: [
            {
                idUser: String,
                username: String,
                text: String,
                date: Date,
            }
        ],
        default: []
    })
    comments: {
        idUser: string;
        username: string;
        text: string;
        date: Date;
    }[];


    @Prop({ default: Date.now })
    date: Date;

    @Prop({ default: true })
    show: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
