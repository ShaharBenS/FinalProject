let UsersAndRoles = require('../../controllers/users/UsersAndRoles');

// variables
exports.noFather = '';
exports.role1 = 'role 1';
exports.role2 = 'role 2';
exports.role3 = 'role 3';
exports.role4 = 'role 4';
exports.role5 = 'role 5';
exports.username1 = 'username1@bgu.aguda.ac var il';
exports.username21 = 'username21@bgu.aguda.ac.il';
exports.username22 = 'username22@bgu.aguda.ac.il';
exports.username31 = 'username31@bgu.aguda.ac.il';
exports.username32 = 'username3@2bgu.aguda.ac.il';
exports.username4 = 'username4@bgu.aguda.ac.il';
exports.username5 = 'username5@bgu.aguda.ac.il';
exports.processStructureName = 'my process structure';
exports.processName = 'active process name';

/*
            <<<INIT ROLE TREE>>>

               +--------+
               | role 1 |
            +--+--------+--+
            |              |
        +---v----+     +---v----+
        | role 2 |     | role 3 |
        +---+----+     +--------+
            |
            v
        +---+----+
        | role 4 |
        +---+----+
            |
            v
        +---+----+
        | role 5 |
        +--------+
 */
exports.initRoleTree = function (done) {
    UsersAndRoles.addNewRole(this.role1, this.noFather, () => {
        UsersAndRoles.addNewRole(this.role2, this.role1, () => {
            UsersAndRoles.addNewRole(this.role3, this.role1, () => {
                UsersAndRoles.addNewRole(this.role4, this.role2, () => {
                    UsersAndRoles.addNewRole(this.role5, this.role4, () => {
                        done();
                    });
                });
            });
        });
    });
};

/*
               <<< MATCH USERS TO ROLES >>>

                +----------------------------+
                |          role 1            |
                |  username1@bgu.aguda.ac.il |
                +-----+------------------+---+
                      |                  |
                      |                  |
                      v                  v
+----------------------------+     +------------------------------+
|          role 2            |     |          role 3              |
| username21@bgu.aguda.ac.il |     | username31@bgu.aguda.ac.il   |
| username22@bgu.aguda.ac.il |     | username3@2bgu.aguda.ac.il   |
+-------------+--------------+     +------------------------------+
              |
              v
+---------------------------+
|          role 4           |
| username4@bgu.aguda.ac.il |
+-------------+-------------+
              |
              v
+---------------------------+
|          role 5           |
| username5@bgu.aguda.ac.il |
+---------------------------+
 */

exports.initMatchUsersToRoles = function (done) {
    UsersAndRoles.addNewUserToRole(this.username1, this.role1,
        () => UsersAndRoles.addNewUserToRole(this.username21, this.role2,
            () => UsersAndRoles.addNewUserToRole(this.username22, this.role2,
                () => UsersAndRoles.addNewUserToRole(this.username31, this.role3,
                    () => UsersAndRoles.addNewUserToRole(this.username32, this.role3,
                        () => UsersAndRoles.addNewUserToRole(this.username4, this.role4,
                            () => UsersAndRoles.addNewUserToRole(this.username5, this.role5, () => done())))))));
};


