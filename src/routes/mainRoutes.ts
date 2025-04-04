
import { ResultSetHeader } from "mysql2";
import { checkPassword, hashPassword } from "../config/bcrypt";
import { conn } from "../config/db";
import { Router, RequestHandler } from 'express';

const mainRoutes = Router();

// Index route
const index: RequestHandler = (req, res) => {
    res.render('index', {username: ""});
};
mainRoutes.get('/', index);

// Login route
const login: RequestHandler = async (req, res) => {
    if(
        typeof req?.body?.username !== "string" ||
        typeof req?.body?.password !== "string"
    ){
        res.status(403).json({error: "Username and password must be strings and not empty."});
        return;
    };
    
    const { username, password } = req.body;
    const login_query: string = 'SELECT password FROM users WHERE username = ? LIMIT 1;';

    conn.query(login_query, [username], async (err, results: ResultSetHeader[]) => {
        if(err){
            res.status(500).json({error: "Error while querying the database."});
            return;
        };
        if(!results || results.length === 0){
            res.status(403).json({error: "User not found."});
            return;
        };
        const user = results[0] as any;
        if(await checkPassword(password, user.password)){
            res.redirect('/');
        }
        else{
            res.status(401).json({error: "Invalid credentials."});
        };
    });
};
mainRoutes.get('/login', async (req, res) => {res.render('login');});
mainRoutes.post('/login', login);

// Registration route
const registration: RequestHandler = async (req, res, next) => {
    if(
        typeof req?.body?.username !== "string" ||
        typeof req?.body?.password !== "string"
    ){
        res.status(403).json({error: "Username and password must be strings and not empty."});
        return;
    };
    try{
        const {username, password} = req.body;
        const new_user_query : string = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?);';
        const default_role : string = JSON.stringify(['ROLE_USER']);

        conn.query(new_user_query, [username, await hashPassword(password), default_role], (err, results) => {
            if(err){throw err;};
            next();
        });
    }
    catch(error){res.status(400).json({error: "Registration failed for some reason."});};
};
mainRoutes.get('/register', async (req, res) => {res.render('register');});
mainRoutes.post('/register', registration, login);

// Logout route
const logout: RequestHandler = (req, res) => {
    res.redirect('/');
};
mainRoutes.get('/logout', logout);

export default mainRoutes;