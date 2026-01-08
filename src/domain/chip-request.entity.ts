import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Club } from './club.entity';
import { UserClub } from './club-user.entity';

@Entity({ name: "REQUEST_CHIP" })
export class ChipRequest extends BaseEntity {
    @PrimaryGeneratedColumn("uuid", { name: "ID" })
    REQUEST_ID: string;

    @ManyToOne(() => Club, (club) => club.CLUB_ID, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'CLUB_ID' })
    CLUB_ID: Club;

    @ManyToOne(() => UserClub, userClub => userClub.ID)
    @JoinColumn({ name: "REQUEST_CLUB_USER_ID" })
    REQUEST_CLUB_USER_ID: UserClub;

    @ManyToOne(() => UserClub, userClub => userClub.ID)
    @JoinColumn({ name: "RECEIVER_CLUB_USER_ID" })
    RECEIVER_CLUB_USER_ID: UserClub;

    @Column({ type: 'int', default: 0 })
    CHIP: number;

    @Column({ type: 'boolean', default: false })
    IS_AGENT: boolean;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    CREATED_DATE: Date;
}