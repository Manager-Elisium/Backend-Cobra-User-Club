import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, BaseEntity } from 'typeorm';
import { Club } from './club.entity';

@Entity({ name: "CLUB_REQUEST" })
export class Request extends BaseEntity {
    @PrimaryGeneratedColumn("uuid", { name: "ID" })
    REQUEST_ID: string;

    // Request
    @Column()
    REQUEST_FROM_USER_ID: string;

    // Club Owner OR Request Agent
    // Accept - Decline
    @Column({ default: null })
    REQUEST_TO_USER_CLUB_ID: string;

    // Club Owner OR Request Agent
    // Accept - Decline
    @Column()
    REQUEST_TO_USER_ID: string;

    // Request
    @ManyToOne(() => Club, (userRequest) => userRequest.REQUEST_USERS, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'REQUEST_TO_CLUB_ID' })
    REQUEST_TO_CLUB_ID: Club;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    CREATED_DATE: Date;
}