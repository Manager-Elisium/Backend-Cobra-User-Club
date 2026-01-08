import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, BaseEntity } from 'typeorm';
import { Club } from './club.entity';


export enum UserType {
   OWNER = "Owner",
   AGENT = "Agent",
   PLAYER = "Player"
}

@Entity({ name: "USER_CLUB" })
export class UserClub extends BaseEntity {
    @PrimaryGeneratedColumn("uuid", { name: "ID" })
    ID: string;

    @Column()
    USER_ID: string;

    @Column('enum', { enum: UserType, default: UserType.PLAYER })
    TYPE: string;

    @ManyToOne(() => Club, (club) => club.JOINT_USERS, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'CLUB_ID' })
    CLUB_ID: Club;

    @Column({ type: 'boolean', default: false })
    IN_GAME_INTERACTIONS: boolean;

    @Column({ type: 'boolean', default: false })
    CLUB_NOTIFICATION: boolean;

    @Column({ type: 'int', default: 0 })
    CHIP: number;

    // When Type is Agent
    @Column({ type: 'int', default: 0 })
    AGENT_CHIP: number;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    CREATED_DATE: Date;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    UPDATED_DATE: Date;

    // UserClub ::: Agent, Owner
    @ManyToOne(() => UserClub, userClub => userClub.ID, { nullable: true })
    @JoinColumn({ name: 'REFERRED_ID' })
    REFERRED_ID: UserClub;

    @Column({ default: null })
    MAIN_SOCKET_ID: string;

    @Column({ default: null })
    GAME_PLAY_SOCKET_ID: string;

    @Column({ type: 'int', default: 0 })
    IN_COUNT_PLAYER: number;

    @Column({ type: 'boolean', default: false })
    IS_DELETE: boolean;

}