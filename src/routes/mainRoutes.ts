import { Router, RequestHandler } from 'express';

const mainRoutes = Router();

// Index route
const index: RequestHandler = (req, res) => {
    let username : string = "";
    if(req.isAuthenticated()){
        username = JSON.stringify((req.user as any).displayName, null, 2).replace(/^"(.*)"$/, '$1')
    };

    res.render('index', {is_authenticated: req.isAuthenticated(), username: username});
};
mainRoutes.get('/', index);

// Profile route
const profile: RequestHandler = (req, res) => {
    const username : string = JSON.stringify((req.user as any).displayName, null, 2).replace(/^"(.*)"$/, '$1');

    if(!req.isAuthenticated()){return res.redirect('/');};
    res.render('profile', {is_authenticated: req.isAuthenticated(), username: username});
};
mainRoutes.get('/profile', profile);

// Logout route
const logout: RequestHandler = (req, res) => {
    res.redirect('/');
};
mainRoutes.get('/logout', logout);

export default mainRoutes;