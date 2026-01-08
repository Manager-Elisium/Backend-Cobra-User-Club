
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, BaseEntity, ManyToMany, OneToMany } from 'typeorm';
import { Club } from './club.entity';
import { UserClub } from './club-user.entity';


export enum TableDesignType {
    STANDARD = "Standard",
    EXCLUSIVE = "Exclusive"
}

@Entity({ name: "CLUB_TABLE" })
export class ClubTable extends BaseEntity {
    @PrimaryGeneratedColumn("uuid", { name: "ID" })
    ID: string;

    @Column('enum', { enum: TableDesignType, default: TableDesignType.STANDARD })
    DESIGN_TYPE: string;

    @Column()
    NO_OF_PLAYER: number;

    @Column()
    TURN_TIME: number;

    @Column()
    NAME: string;

    @Column()
    ENTRY_FEES: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    RAKE: number;

    @Column({ type: 'boolean', default: false })
    IN_GAME_INTERACTIONS: boolean;

    @ManyToOne(() => Club, (club) => club.JOINT_USERS, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'CLUB_ID' })
    CLUB_ID: Club;

    @Column({ type: 'boolean', default: false })
    IN_RUNNING_TABLE: boolean;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    CREATED_DATE: Date;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    UPDATED_DATE: Date;

    @Column({ type: 'jsonb', default: [] })
    JOINT_TABLE_CLUB_USER: any;

    @Column({ default : 0 })
    JOINT_PLAYER: number;

}

// TABLE_ID
// ENTRY_FEES
// CLUB_ID
// JOINT_TABLE_CLUB_USER
// JOINT_PLAYER


