import { hash, compare } from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    const hashed_password : string = await hash(password, 10);
    return hashed_password;
};

export const checkPassword = async (password: string, hashed_password: string): Promise<boolean> => {
    const password_ok : boolean = await compare(password, hashed_password);
    return password_ok;
};