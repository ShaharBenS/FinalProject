let indexRouter = require('.');
let sankeyRouter = require('./sankeyRouter');

let activeProcessesRouter = require('./processesRouters/activeProcessesRouter');
let permissionErrorsRouter = require('./errorsRouters/permissionErrorsRouter');
let processStructuresRouter = require('./processesRouters/processStructuresRouter');
let processNotificationRouter = require('./notificationRouters/notificationsRouter');

let auth = require('./usersRouters/auth');
let usersAndRolesRouter = require('./usersRouters/usersAndRolesRouter');
let userLoggedInRouter = require('./usersRouters/userLoggedInRouter');

let uploadFilesRouter = require('./uploadFiles/uploadFilesRouter');

module.exports = (app)=>{
    app.use('/', indexRouter);
    app.use('/sankey', sankeyRouter);

    app.use('/activeProcesses', activeProcessesRouter);

    app.use('/permissionErrors', permissionErrorsRouter);

    app.use('/processStructures', processStructuresRouter);
    app.use('/notifications', processNotificationRouter);
    app.use('/usersAndRoles', usersAndRolesRouter);
    app.use('/userLoggedIn', userLoggedInRouter);
    app.use('/auth', auth);
    app.use('/uploadFile', uploadFilesRouter)
};
