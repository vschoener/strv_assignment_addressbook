import { FirebaseInterface } from './firebase/firebaseInterface';

export class Context {
    public firebase: FirebaseInterface;
    public jwtExpire: number;

    constructor(private env: string, private jwtSecret: string) {}

    getJWTSecret(): string {
        return this.jwtSecret;
    }

    getEnv(): string {
        return this.env;
    }
}
