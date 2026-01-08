import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, BeforeInsert } from 'typeorm';
import { UserClub } from './club-user.entity';
import { ClubRequest } from './club-request.entity';
import { AppDataSource } from 'src/connection/ormconfig';
import { Request } from './request.entity';

@Entity({ name: "CLUB" })
export class Club extends BaseEntity {
    @PrimaryGeneratedColumn("uuid", { name: "ID" })
    CLUB_ID: string;

    @Column({ unique: true })
    NAME: string;

    @Column()
    SEARCH_ID: string;

    @Column()
    USER_ID: string;

    @Column()
    AVATAR: string;

    @Column({ default: 0 })
    TOTAL_GAME_PLAYED: number;

    @Column({ default: "IN" })
    COUNTRY_CODE: string;

    @Column({ default: null })
    NOTICE_NAME: string;

    @Column({ default: null })
    NOTICE_DESCRIPTION: string;

    @OneToMany(() => UserClub, (userClub) => userClub.CLUB_ID)
    JOINT_USERS: UserClub[];

    @OneToMany(() => ClubRequest, (userClub) => userClub.INVITED)
    REQUEST_USERS: ClubRequest[];

    @OneToMany(() => Request, (requestClub) => requestClub.REQUEST_TO_CLUB_ID)
    REQUEST_TO_CLUB: Request[];

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    CREATED_DATE: Date;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    UPDATED_DATE: Date;

    @BeforeInsert()
    async assignRoomSequence() {
        const entityManager = AppDataSource.getRepository(Club);
        const sequenceQuery = "SELECT nextval('club_sequence')";
        const result = await entityManager.query(sequenceQuery);
        const randomString = [...Array(6)].map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
        this.SEARCH_ID = `${randomString}${result[0].nextval}`;
    }
}

// CREATE SEQUENCE IF NOT EXISTS public.club_sequence
//     INCREMENT 1
//     START 1
//     MINVALUE 1
//     MAXVALUE 9223372036854775807
//     CACHE 1
//     OWNED BY "CLUB"."SEARCH_ID";
