declare module 'mongoose' {
    import * as Bluebird from 'bluebird';
    type Promise<T> = Bluebird<T>;
}
