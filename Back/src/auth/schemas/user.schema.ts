import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    birthDate: string;

    @Prop()
    description?: string;

    @Prop()
    image_url?: string;

    @Prop({ default: false })
    admin: boolean;

    @Prop({ default: Date.now })
    createdAt?: Date;

    @Prop({ default: true })
    show: boolean;


}

export const UserSchema = SchemaFactory.createForClass(User);