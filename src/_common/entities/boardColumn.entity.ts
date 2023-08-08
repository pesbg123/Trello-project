import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';
import { Board } from './board.entity';

@Entity('boardColumns')
export class BoardColumn {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false, length: 50 })
  name: string;

  @Column({ nullable: false })
  sequence: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.boardColumns, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  project: Project;

  @OneToMany(() => Board, (board) => board.boardColumn, {
    cascade: true,
  })
  boards: Board[];
}
