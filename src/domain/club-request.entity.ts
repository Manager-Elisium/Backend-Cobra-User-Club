import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, BaseEntity } from 'typeorm';
import { Club } from './club.entity';
import { UserClub } from './club-user.entity';

@Entity({ name: "REQUEST_CLUB" })
export class ClubRequest extends BaseEntity {
    @PrimaryGeneratedColumn("uuid", { name: "ID" })
    REQUEST_ID: string;

    // Request
    @ManyToOne(() => Club, (userRequest) => userRequest.REQUEST_USERS, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'INVITED' })
    INVITED: Club;

    // Request
    @Column()
    INVITED_USER_ID: string;

    // Club Owner OR Request Agent
    // Accept - Decline
    @Column({ default: null })
    REQUESTED_USER_CLUB_ID: string;

    // Club Owner OR Request Agent
    // Accept - Decline
    @Column()
    REQUESTED_USER_ID: string;

    @Column({ type: 'boolean', default: false })
    IS_AGENT: boolean;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    CREATED_DATE: Date;
}