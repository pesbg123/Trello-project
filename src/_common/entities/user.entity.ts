import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';
import { ProjectMember } from './projectMember.entity';
import { Board } from './board.entity';
import { Comment } from './comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false, length: 40 })
  email: string;

  @Column({ nullable: false, length: 10 })
  name: string;

  @Column({ nullable: false, length: 128 })
  password: string;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Project, (project) => project.user, {
    cascade: true,
  })
  projects: Project[];

  @OneToMany(() => ProjectMember, (projectMember) => projectMember.user, {
    cascade: true,
  })
  projectMembers: ProjectMember[];

  @OneToMany(() => Board, (board) => board.user, {
    cascade: true,
  })
  boards: Board[];

  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
  })
  comments: Comment[];
}
