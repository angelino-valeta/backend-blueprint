import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('audits')
export class Audit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  action!: string;

  @Column({ name: 'userId', nullable: true })
  userId?: number;

  @Column('jsonb')
  details!: any;

  @Column()
  timestamp!: string;

  @Column({ name: 'traceId', nullable: true })
  traceId?: string;
}