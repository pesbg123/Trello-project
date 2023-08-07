import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { ProjectMember } from './projectMember.entity';
import { Board } from './board.entity';
import { BoardColumn } from './boardColumn.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false, length: 20 })
  name: string;

  @Column({ nullable: false })
  desc: string;

  @Column({ nullable: true, length: 10 })
  backgroundColor: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.projects, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @OneToMany(() => ProjectMember, (projectMember) => projectMember.project, {
    cascade: true,
  })
  projectMembers: ProjectMember[];

  @OneToMany(() => Board, (board) => board.project, {
    cascade: true,
  })
  boards: Board[];

  @OneToMany(() => BoardColumn, (boardColumn) => boardColumn.project, {
    cascade: true,
  })
  boardColumns: BoardColumn[];
}
