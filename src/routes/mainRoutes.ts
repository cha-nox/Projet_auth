
import { QueryResult, ResultSetHeader } from "mysql2";
import { checkPassword, hashPassword } from "../config/bcrypt";
import { conn } from "../config/db";
import { Router, RequestHandler } from 'express';

const mainRoutes = Router();

// Teapot route
mainRoutes.get('/tea', (req, res) => {res.status(418).send("Hey, do you like tea ? I really love it !")});

// Users list route (might be removed later)
const getUsersList: RequestHandler = async (req, res) => {
    try{
        conn.query('SELECT * FROM users;', (err, results) => {
            if(err){throw err;};
            res.status(200).json(results);
        });
    }
    catch(error){res.status(400).json({error: "Failed to get data."});};
};
mainRoutes.get('/users_list', getUsersList);

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
            res.status(200).json({message: "Login successful."});
        }
        else{
            res.status(401).json({error: "Invalid credentials."});
        };
    });
};
mainRoutes.post('/login', login);

// Registration route
const registration: RequestHandler = async (req, res, next) => {
    console.log(req.body);
    if(
        typeof req?.body?.username !== "string" ||
        typeof req?.body?.password !== "string"
    ){
        res.status(403).json({error: "Username and password must be strings and not empty."});
        return;
    };
    try{
        const {username, password} = req.body;
        const new_user_query : string = 'INSERT INTO users (username, password) VALUES (?, ?);';

        conn.query(new_user_query, [username, await hashPassword(password)], (err, results) => {
            if(err){throw err;};
            next();
        });
    }
    catch(error){res.status(400).json({error: "Registration failed for some reason."});};
};
mainRoutes.post('/register', registration, login);

export default mainRoutes;