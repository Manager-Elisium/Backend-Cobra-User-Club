import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, BaseEntity, ManyToOne } from 'typeorm';
import { UserClub } from './club-user.entity';

export enum TransactionType {
    CHIP_SEND = "Chip Send",
    CLAIM_BACK = "Claimed Back"
}

@Entity({ name: "CHIP_TRANSACTION_CLUB" })
export class ChipTransaction extends BaseEntity {
    @PrimaryGeneratedColumn("uuid", { name: "ID" })
    TRANSACTION_ID: string;

    @ManyToOne(() => UserClub, userClub => userClub.ID)
    @JoinColumn({ name: "RECEIVER" })
    RECEIVER: UserClub;

    @ManyToOne(() => UserClub, userClub => userClub.ID)
    @JoinColumn({ name: "SENDER" })
    SENDER: UserClub;

    @Column({ type: 'int', default: 0 })
    CHIP: number;

    @Column('enum', { enum: TransactionType, default: TransactionType.CHIP_SEND })
    TRANSACTION_TYPE: string;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    CREATED_DATE: Date;
}