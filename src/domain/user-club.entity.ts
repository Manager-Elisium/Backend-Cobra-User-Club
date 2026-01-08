// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, BaseEntity } from 'typeorm';



// @Entity({ name: "CLUB" })
// export class ClubRequest extends BaseEntity {
//     @PrimaryGeneratedColumn("uuid", { name: "ID" })
//     CLUB_ID: string;

//     @Column({ unique: true })
//     NAME: string;

//     @Column()
//     USER_ID: string;

//     @Column({ type: 'timestamptz', default: () => 'NOW()' })
//     CREATED_DATE: Date;

//     @Column({ type: 'timestamptz', default: () => 'NOW()' })
//     UPDATED_DATE: Date;
// }