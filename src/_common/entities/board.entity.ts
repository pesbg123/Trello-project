import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { Comment } from './comment.entity';
import { BoardColumn } from './boardColumn.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false, length: 50 })
  title: string;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: true, type: 'json' })
  collaborators: string[];

  @Column({ nullable: false, length: 10 })
  color: string;

  @Column({ nullable: true })
  file: string;

  @Column({ nullable: false })
  deadlineAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.boards, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Project, (project) => project.boards, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  project: Project;

  @OneToMany(() => Comment, (comment) => comment.board, {
    cascade: true,
  })
  comments: Comment[];

  @ManyToOne(() => BoardColumn, (boardColumn) => boardColumn.boards, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  boardColumn: BoardColumn;
}
