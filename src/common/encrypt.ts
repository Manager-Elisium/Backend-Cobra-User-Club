import * as crypto from 'crypto';
import StandardError from './standard-error';
import { ErrorCodes } from './error-type';
import { error, info, success } from './logger';

const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);

async function encrypt(text: string, secretKey: string): Promise<{ public_key: string, content: string }> {
    try {
        info(`******************************************`);
        success(`Response : ${text}`);
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return {
            public_key: iv.toString('hex'),
            content: encrypted.toString('hex')
        };
    } catch (error) {
        throw new StandardError(
            ErrorCodes.FORM_VALIDATION_ERROR,
            "Don't try to hack. It's impossible."
        );
    }
}

async function decrypt(data: { public_key: string, content: string }, secretKey: string): Promise<string | { public_key: string, content: string }> {
    try {
        const { public_key, content } = data;
        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(public_key, 'hex'));
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
        info(`******************************************`);
        error(`Request : ${decrpyted.toString()}`);
        return decrpyted.toString();
    } catch (error) {
        throw new StandardError(
            ErrorCodes.FORM_VALIDATION_ERROR,
            "Don't try to hack. It's impossible."
        );
    }
}

export { encrypt, decrypt };


console.log(encrypt(JSON.stringify({
    "USER_CLUB_ID": ["5a752f7a-f4fe-4eb0-bc6f-d52e76af12db"],
    "CHIP": 100
}), 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR'))

// console.log(encrypt(JSON.stringify({
//     "NAME": "Club 10", "AVATAR": "10", "COUNTRY_CODE": "IN"
// }), 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR'))

// console.log(encrypt(JSON.stringify({
//     DESIGN_TYPE: "Standard",
//     NO_OF_PLAYER: 2,
//     TURN_TIME: 30,
//     NAME: "Table 1",
//     ENTRY_FEES: 300,
//     RAKE: 10.5,
//     IN_GAME_INTERACTIONS: false,
//     CLUB_ID: "845bf80f-a514-4184-92c3-6887bfa5c538"
// }), "SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR"))


// console.log(encrypt(JSON.stringify({
//     "IN_GAME_INTERACTIONS" : true
// }), 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR'))

