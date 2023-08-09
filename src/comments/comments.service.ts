import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createComment(): Promise<void> {}

  async getComments(): Promise<void> {}

  async updateComment(): Promise<void> {}

  async deleteComment(): Promise<void> {}
}
