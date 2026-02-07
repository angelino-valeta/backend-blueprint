import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string;

  @Column('jsonb')
  payload!: any;

  @Column()
  timestamp!: string;

  @Column({ name: 'userId', nullable: true })
  userId?: number;

  @Column({ name: 'traceId', nullable: true })
  traceId?: string;
}