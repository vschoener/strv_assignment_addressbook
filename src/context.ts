import { FirebaseInterface } from './firebase/firebaseInterface';

export class Context {
    public firebase: FirebaseInterface;

    constructor(private env: string, private jwtSecret: string) {}

    getJWTSecret(): string {
        return this.jwtSecret;
    }

    getEnv(): string {
        return this.env;
    }
}
