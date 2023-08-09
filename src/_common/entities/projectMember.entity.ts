import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('projectMembers')
export class ProjectMember {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false, default: false })
  participation: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.projects, {
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Project, (project) => project.projectMembers, {
    nullable: false,
  })
  project: Project;
}
