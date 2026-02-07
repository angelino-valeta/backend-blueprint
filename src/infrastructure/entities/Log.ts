import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  level!: string

  @Column()
  message!: string

  @Column()
  timestamp!: string

  @Column({ name: 'trace_id', nullable: true })
  traceId?: string
}