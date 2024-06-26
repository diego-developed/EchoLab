/**
 * @file api/index.js
 * @description Inward facing wrapper interface
 */

import compileRoutes from './compile.js';
import deleteRoomRoutes from './deleteroom.js';
import deleteUserRoutes from './deleteuser.js';
import editorRoutes from './editor.js';
import homeRoutes from './home.js';
import loginRoutes from './login.js';
import logoutRoutes from './logout.js';
import registerRoutes from './register.js';

const constructorMethod = (app) => {
    app.use('/logout', logoutRoutes);
    app.use('/login', loginRoutes);
    app.use('/register', registerRoutes);
    app.use('/editor', editorRoutes);
    app.use('/home', homeRoutes);
    app.use('/compile', compileRoutes);
    app.use('/deleteroom', deleteRoomRoutes);
    app.use('/deleteuser', deleteUserRoutes);
    app.use('*', (_, res) => {
        res.redirect('/login');
    });
};

export default constructorMethod;
