import { Injectable } from '@nestjs/common';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class StatsService {
  create(createStatDto: CreateStatDto) {
    return 'This action adds a new stat';
  }
  constructor(
    @InjectModel('Post') private postModel: Model<Post>,
  ) { }

  async getPostsPerUser(from: Date, to: Date) {
    return this.postModel.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      { $group: { _id: "$idUser", count: { $sum: 1 }, username: { $first: "$username" } } }
    ]);
  }

  async getCommentsCount(from: Date, to: Date) {
    const result = await this.postModel.aggregate([
      { $unwind: "$comments" },
      { $match: { "comments.date": { $gte: from, $lte: to } } },
      { $count: "totalComments" }
    ]);

    return { totalComments: result[0]?.totalComments || 0 };
  }


  async getCommentsPerPost(from: Date, to: Date) {
    return this.postModel.aggregate([
      { $unwind: "$comments" },
      { $match: { "comments.date": { $gte: from, $lte: to } } },
      { $group: { _id: "$_id", title: { $first: "$content" }, count: { $sum: 1 } } }
    ]);
  }
}

