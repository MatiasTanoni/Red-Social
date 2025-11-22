export interface PostsPerUser {
  username: string;
  count: number;
}

export interface CommentsCount {
  totalComments: number;
}

export interface CommentsPerPost {
  title: string;
  count: number;
}
