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
let signaturesRouter = require('./onlineFormsRoutes/signatureRouter');
https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
// response_type=code&
// redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Foutlook%2Fcallback&
// scope=openid%20profile%20offline_access%20https%3A%2F%2Foutlook.office.com%2FMail.Read&
// client_id=ba13fb4b-878c-4d71-a5eb-f68305542676
module.exports = (app) => {
    app.use('/', indexRouter);
    app.use('/auth', auth);
    app.all('*', function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/');
        }
    });
    app.use('/sankey', sankeyRouter);
    app.use('/activeProcesses', activeProcessesRouter);
    app.use('/permissionErrors', permissionErrorsRouter);
    app.use('/processStructures', processStructuresRouter);
    app.use('/notifications', processNotificationRouter);
    app.use('/usersAndRoles', usersAndRolesRouter);
    app.use('/uploadFile', uploadFilesRouter);
    app.use('/permissionsControl', userPermissionsControl);
    app.use('/uploadFile', uploadFilesRouter);
    app.use('/onlineForms', onlineFormsRouter);
    app.use('/signature', signaturesRouter);
};
