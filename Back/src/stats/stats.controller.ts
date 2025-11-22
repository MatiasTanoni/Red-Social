import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) { }

  @Get('posts-per-user')
  postsPerUser(@Query('from') from: string, @Query('to') to: string) {
    return this.statsService.getPostsPerUser(new Date(from), new Date(to));
  }

  @Get('comments-count')
  commentsCount(@Query('from') from: string, @Query('to') to: string) {
    return this.statsService.getCommentsCount(new Date(from), new Date(to));
  }

  @Get('comments-per-post')
  commentsPerPost(@Query('from') from: string, @Query('to') to: string) {
    return this.statsService.getCommentsPerPost(new Date(from), new Date(to));
  }
}

