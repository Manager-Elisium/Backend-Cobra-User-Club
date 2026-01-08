import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { ClubTable } from './club-table.entity';
import { UserClub } from './club-user.entity';

@Entity({ name: "CLUB_PLAY" })
export class ClubPlay extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "ID" })
  ID: string;

  @Column({ type: 'boolean', default: false })
  IS_GAME_FINISH: boolean;

  @Column({ default: 0 })
  CURRENT_ROUND_NUMBER: number;


  @ManyToOne(() => ClubTable, (club) => club.ID, { nullable: false })
  @JoinColumn({ name: 'TABLE_ID' })
  TABLE_ID: ClubTable;

  @Column({ nullable: true })
  WIN_USER: string;

  @Column({ type: 'jsonb' })
  USERS: any;

  @Column({ type: 'jsonb', nullable: true })
  TURN_DECIDE_DECK: any;

  @Column({ type: 'jsonb', default: []  })
  ROUND_INFO: any;

  @Column({ nullable: true })
  CURRENT_TURN: string;

  @Column({ type: 'jsonb', nullable: true })
  GAME_DECK: any;

  @Column({ type: 'jsonb', default: [] })
  DROP_DECK: any;

  @Column('simple-array', { nullable: true })
  USER_WIN_RANK: string[];

  @Column({ type: 'jsonb', default: [] })
  CURRENT_DROP_DECK: any;

  @Column({ type: 'jsonb', default: [] })
  PREVIOUS_DROP_DECK: any;

  @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  CREATED_DATE: Date;

  @Column('timestamp with time zone', { nullable: true })
  UPDATED_DATE: Date;

  @Column('timestamp with time zone', { nullable: true })
  GAME_FINISH_DATE: Date;
}