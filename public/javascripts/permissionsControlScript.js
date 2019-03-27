function showPermissionsByUser(selectObject)
{
    let userEmail = selectObject.value;
    if(userEmail !== "choose_user")
    {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "/permissionsControl/getUserPermissions?userEmail=" + userEmail, false);
        xmlHttp.send();
        let response = xmlHttp.responseText;
        let permissionsArray = JSON.parse(response);
        document.getElementById("all_checkbox").style.display = 'block';
        document.getElementsByName("UserManagementsPermission")[0].checked = permissionsArray[0];
        document.getElementsByName("StructureManagementsPermission")[0].checked = permissionsArray[1];
        document.getElementsByName("ObserverPermission")[0].checked = permissionsArray[2];
        document.getElementsByName("PermissionManagementPermission")[0].checked = permissionsArray[3];
        let pre = "ניהול הרשאות עבור ";
        document.getElementById("which_user_is_now").innerText = pre + userEmail;
    }
    else
    {
        document.getElementById("all_checkbox").style.display = 'none';
        document.getElementById("which_user_is_now").innerText = '';
    }
}
function submitPermissionsForm()
{
    let userEmail = document.getElementsByName("userEmail")[0].value;
    if(userEmail !== "choose_user")
    {
        let userPermission = document.getElementsByName("UserManagementsPermission")[0].checked;
        let structurePermission = document.getElementsByName("StructureManagementsPermission")[0].checked;
        let observerPermission = document.getElementsByName("ObserverPermission")[0].checked;
        let permissionsPermission = document.getElementsByName("PermissionManagementPermission")[0].checked;
        let data = {'userEmail': userEmail, 'userManagementPermission': userPermission,
            'structureManagementPermission': structurePermission, 'observerPermission': observerPermission,
            'permissionManagementPermission': permissionsPermission
        };
        $.ajax({
                url: '/permissionsControl/setUserPermissions',
                method: "POST",
                xhrFields: {
                    withCredentials: true
                },
                data: data,
            }
        ).done(function (responseText, status) {
            if (status === "success") {
                if (responseText === "success") {
                    alert("ההרשאות ניתנו בהצלחה");
                } else {
                    alert(responseText);
                }
            }
        });
    }
    else
    {
        alert('בחר משתמש');
    }
    return false;
}