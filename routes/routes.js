let indexRouter = require('.');
let sankeyRouter = require('./sankeyRouter');

let activeProcessesRouter = require('./processesRouters/activeProcessesRouter');
let permissionErrorsRouter = require('./errorsRouters/permissionErrorsRouter');
let processStructuresRouter = require('./processesRouters/processStructuresRouter');
let processNotificationRouter = require('./notificationRouters/notificationsRouter');

let auth = require('./usersRouters/auth');
let usersAndRolesRouter = require('./usersRouters/usersAndRolesRouter');

let uploadFilesRouter = require('./uploadFiles/uploadFilesRouter');
let userPermissionsControl = require('./usersRouters/permissionsControlRouter');

let onlineFormsRouter = require('./onlineFormsRoutes/onlineFormsRouter');

module.exports = (app)=>{
    app.use('/', indexRouter);
    app.use('/sankey', sankeyRouter);

    app.use('/activeProcesses', activeProcessesRouter);

    app.use('/permissionErrors', permissionErrorsRouter);

    app.use('/processStructures', processStructuresRouter);
    app.use('/notifications', processNotificationRouter);
    app.use('/usersAndRoles', usersAndRolesRouter);
    app.use('/auth', auth);
    app.use('/uploadFile', uploadFilesRouter);
    app.use('/permissionsControl', userPermissionsControl);
    app.use('/uploadFile', uploadFilesRouter);
    app.use('/onlineForms', onlineFormsRouter)
};
