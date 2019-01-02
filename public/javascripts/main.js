function addProcessStructureClicked() {
    let structureName = prompt("Enter new process structure name:");
    //TODO: check structure name is alphabetical.
    if (!(structureName === null || structureName === "")) {
       window.location.href = '/processStructures/addProcessStructure/?name='+structureName;
    }
}
function editProcessStructureClicked() {
    let structureName = prompt("Enter desired process structure name:");
    //TODO: check structure name is alphabetical.
    if (!(structureName === null || structureName === "")) {
        window.location.href = '/processStructures/editProcessStructure/?name='+structureName;
    }
}
function editUsersAndRolesTree() {
    window.location.href = '/usersAndRoles/editTree/'
}