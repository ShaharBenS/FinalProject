let indexRouter = require('.');
let sankeyRouter = require('./sankeyRouter');

let activeProcessesRouter = require('./processesRouters/activeProcessesRouter');
let permissionErrorsRouter = require('./errorsRouters/permissionErrorsRouter');
let processStructuresRouter = require('./processesRouters/processStructuresRouter');

let auth = require('./usersRouters/auth');
let usersAndRolesRouter = require('./usersRouters/usersAndRolesRouter');
let usersLoginRouter = require('./usersRouters/usersLoginRouter');

module.exports = (app)=>{
    app.use('/', indexRouter);
    app.use('/sankey', sankeyRouter);

    app.use('/activeProcesses', activeProcessesRouter);

    app.use('/permissionErrors', permissionErrorsRouter);

    app.use('/processStructures', processStructuresRouter);

    app.use('/usersAndRoles', usersAndRolesRouter);
    app.use('/usersLogin', usersLoginRouter);
    app.use('/auth', auth);
};
