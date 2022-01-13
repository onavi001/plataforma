import {
    LOGIN,
    LOGINSUCCESS,
    LOGINERROR,
    LOGOUT,
    LOGOUTSUCCESS,
    LOGOUTERROR,
    REFRESHTOKEN,
    REFRESHTOKENSUCCESS,
    REFRESHTOKENERROR,
    GETUSER,
    GETUSERSUCCESS,
    GETUSERERROR,
    GETUSERS,
    GETUSERSSUCCESS,
    GETUSERSERROR,
    CREATEUSERS,
    CREATEUSERSSUCCESS,
    CREATEUSERSERROR,
    EDITUSERS,
    EDITUSERSSUCCESS,
    EDITUSERSERROR,
    EDITPERMISSIONSUSERS,
    EDITPERMISSIONSUSERSSUCCESS,
    EDITPERMISSIONSUSERSERROR,
    DELETEUSER,
    DELETEUSERSUCCESS,
    DELETEUSERERROR,
    GETGPSMODELS,
    GETGPSMODELSSUCCESS,
    GETGPSMODELSERROR,
    FORGOTPASSWORD,
    FORGOTPASSWORDSUCCESS,
    FORGOTPASSWORDERROR,
    RESETPASSWORD,
    RESETPASSWORDSUCCESS,
    RESETPASSWORDERROR,
    ACTIVEUSERS,
    ACTIVEUSERSSUCCESS,
    ACTIVEUSERSERROR,
    CHANGESTATE
} from '../types';
import backendJona from "../../services/api";
//const httpsAgent = new https.Agent({ rejectUnauthorized: true })
/**
 * token demora 20
    refresh 60 minutos
 */
// Login con backend Jonathan
export function loginAction(email,password) {
    return async (dispatch) => {
        
        dispatch( login() );
        try {
            //create token
            backendJona.post('/token/create', {
                EMail: email,
                Password: password
            }).then(response => {
                //se guardan los token en localstorage para su uso
                sessionStorage.setItem('accessToken', response.data.accessToken);
                sessionStorage.setItem('refreshToken', response.data.refreshToken);
                sessionStorage.setItem('expiration', response.data.expiration);
                //login
                const accessToken = response.data.accessToken
                backendJona.get(`/users/login?UserEmail=${email}`,{
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }).then(response => {
                    //save data
                    const usuario = response.data;
                    sessionStorage.setItem('user',(JSON.stringify(response.data)));
                    sessionStorage.setItem('EMail', response.data.email);
                    sessionStorage.setItem('RequesterId', response.data.id);
                    sessionStorage.setItem('loggedIn', true);
                    dispatch( loginSuccess(usuario) )
                }).catch(error => {
                    dispatch( loginError("Error al iniciar sesión") )
                });
            }).catch(error => {
                dispatch(loginError(error.response.data))
            });
        } catch (error) {
            //'Error al iniciar sesion'
            dispatch( loginError("Error al iniciar sesión") )
        }
    }
}
const login = () => ({
    type: LOGIN
})
const loginSuccess = (usuario) => ({
    type: LOGINSUCCESS,
    payload: usuario
})
const loginError = (error) => ({
    type: LOGINERROR,
    payload : error
})
//getUserData Backedn Jonathan
export function getUserAction() {
    return async (dispatch) => {
        dispatch( getUser() );
        try {
            const localStorage_login = sessionStorage.getItem('loggedIn')
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_refreshToken = sessionStorage.getItem('refreshToken')
            const localStorage_EMail = sessionStorage.getItem('EMail')
            if (localStorage_login) {
                backendJona.get(`/users/login?UserEmail=${localStorage_EMail}`,{
                    headers: {
                        'Authorization': `Bearer ${localStorage_accessToken}`
                    }
                }).then(response => {
                    //save data
                    sessionStorage.setItem('user',(JSON.stringify(response.data)));
                    const usuario = response.data;
                    sessionStorage.setItem('loggedIn', true);
                    dispatch( getUserSuccess(usuario) )
                }).catch(error => {
                    if (error.response && error.response.status === 401) {
                        //el usuario no esta autorizado o expiro su token
                        //mandamos a hacer un refresh de su token
                        if (localStorage_refreshToken && localStorage_refreshToken.length > 0) {
                            dispatch(refreshTokenAction())
                        }
                    }else{
                        dispatch( getUserError() )
                    }
                });
            } else {
                //no esta logeado

            }
        } catch (error) {
            dispatch( getUserError() )
        }
    }
}
export function getUserActionLocalStorage(user,permissions,services) {
    return (dispatch) => {
        dispatch( getUserSuccess(user,permissions,services) );
    }
}
const getUser = () => ({
    type: GETUSER
})
const getUserSuccess = (usuario,permissions,services) => ({
    type: GETUSERSUCCESS,
    payload: usuario,
    permissions : permissions,
    services : services
})
const getUserError = () => ({
    type: GETUSERERROR
})
//
//get Users by id
export function getUserByIdAction(userId) {
    return async (dispatch) => {
        dispatch( getUserById() );
        try {
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            backendJona.get(`/users/GetUserById?RequesterId=${localStorage_RequesterId}&UserId=${userId}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                const user = response.data;
                dispatch( getUsersByIdSuccess(user) )
            }).catch(error => {
                dispatch( getUsersByIdError() )
            });

        } catch (error) {
            dispatch( getUsersByIdError() )
        }
    }
}
const getUserById = () => ({
    type: GETUSER
})
const getUsersByIdSuccess = (usuario) => ({
    type: GETUSERSUCCESS,
    payload: usuario
})
const getUsersByIdError = () => ({
    type: GETUSERERROR
})
//refresh Token
export function refreshTokenAction() {
    return async (dispatch) => {
        dispatch( refreshToken() );
        try {
            const localStorage_refreshToken = sessionStorage.getItem('refreshToken')
            const localStorage_EMail = sessionStorage.getItem('EMail')
            backendJona.post(`/token/refresh`,{
                "UserEmail" : localStorage_EMail,
                "Token" : localStorage_refreshToken
            }).then(response => {
                //save data
                //obtenemos datos y volvemos a hacer el login
                dispatch( refreshTokenSuccess() )
                //se guardan los token en localstorage para su uso
                sessionStorage.setItem('accessToken', response.data.accessToken);
                sessionStorage.setItem('refreshToken', response.data.refreshToken);
                sessionStorage.setItem('expiration', response.data.expiration);
            }).catch(error => {
                if (error.response.status === 400 && error.response.data && (error.response.data === "Invalid refresh token." || error.response.data ===  "Expired refresh token.")) {
                    //el usuario no esta autorizado y su token expiro
                    //logout automatico
                    dispatch(logoutAction())
                }else{
                    dispatch( refreshTokenError() )
                }
            });
        } catch (error) {
            dispatch( refreshTokenError() )
        }
    }
}
const refreshToken = () => ({
    type: REFRESHTOKEN
})
const refreshTokenSuccess = () => ({
    type: REFRESHTOKENSUCCESS
})
const refreshTokenError = () => ({
    type: REFRESHTOKENERROR
})
// Logout con backend Jonathan
export function logoutAction() {
    return async (dispatch) => {
        dispatch( logout() );
        try {
            //const resultado = await apiClient.delete(`/productos/${id}`)
            const localStorage_login = sessionStorage.getItem('loggedIn')
            backendJona.post('/token/revoke',{
                Token: localStorage_login,
            }).then(response => {
                if (response.status === 204) {
                    sessionStorage.setItem('loggedIn', false);
                    sessionStorage.setItem('accessToken', "");
                    sessionStorage.setItem('refreshToken', "");
                    sessionStorage.setItem('expiration', "");
                    sessionStorage.setItem('EMail', "");
                    sessionStorage.setItem('RequesterId', "");
                    dispatch( logoutSuccess() )
                }else{
                    dispatch( logoutError() )
                }
            }).catch(function (error) {
                dispatch( logoutError() )
            });
        } catch (error) {
            dispatch( logoutError() )
        }
    }
}
const logout = () => ({
    type: LOGOUT
})
const logoutSuccess = () => ({
    type: LOGOUTSUCCESS
})
const logoutError = () => ({
    type: LOGOUTERROR
})
//get Users
export function getUsersAction(accountId) {
    return async (dispatch) => {
        dispatch( getUsers() );
        try {
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            backendJona.get(`/users/GetUsers?RequesterId=${localStorage_RequesterId}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                const users = response.data;
                dispatch( getUsersSuccess(users) )
            }).catch(error => {
                dispatch( getUsersError() )
            });

        } catch (error) {
            dispatch( getUsersError() )
        }
    }
}
const getUsers = () => ({
    type: GETUSERS
})
const getUsersSuccess = (usuario) => ({
    type: GETUSERSSUCCESS,
    payload: usuario
})
const getUsersError = () => ({
    type: GETUSERSERROR
})
//create
export function createUsersAction(user) {
    return async (dispatch) => {
        dispatch( createUsers() );
        try {
            const RequesterId = sessionStorage.getItem('RequesterId')
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            backendJona.post(`/Users/SaveUser?RequesterId=${RequesterId}`,
            user,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                getUsersAction(0);
                dispatch( createUsersSuccess(response.data) )
            }).catch(function (error) {
                dispatch( createUsersError() )
            });
        } catch (error) {
            dispatch( createUsersError() )
        }
    }
}
const createUsers = () => ({
    type: CREATEUSERS
})
const createUsersSuccess = (user) => ({
    type: CREATEUSERSSUCCESS,
    payload : user
})
const createUsersError = () => ({
    type: CREATEUSERSERROR
})
//edit user
export function editUsersAction(user) {
    return async (dispatch) => {
        dispatch( editUsers() );
        try {
            const RequesterId = sessionStorage.getItem('RequesterId')
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            console.log(user)
            const updateUser = {
                Email : user.email,
                Name : user.name,
                //Password : user."Edgar123",
                Active : user.active,
                Roles : user.roles,
                Type : user.userType,
                Profile: user.profile
            }
            if(user.Password){
                updateUser.Password = user.Password;
            }
            backendJona.put(`/users/UpdateUser?RequesterId=${RequesterId}&UserId=${user.id}&AccountOwnerUser=${user.accountId}`,
            updateUser,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                const currentUserPrincipal =  JSON.parse(sessionStorage.getItem('user'));
                console.log((currentUserPrincipal))
                if(currentUserPrincipal && currentUserPrincipal.id === user.id){
                    user.roles = currentUserPrincipal.roles;
                    currentUserPrincipal.Profile = user.profile;
                    currentUserPrincipal.name = user.name;
                    sessionStorage.setItem('user',(JSON.stringify(currentUserPrincipal)));
                }
                dispatch( editUsersSuccess(user) )
                //dispatch( createUsersSuccess(response.data) )
            }).catch(function (error) {
                dispatch( editUsersError(error.response.data) )
            });
        } catch (error) {
            dispatch( editUsersError() )
        }
    }
}
const editUsers = () => ({
    type: EDITUSERS
})
const editUsersSuccess = (usuario) => ({
    type: EDITUSERSSUCCESS,
    payload: usuario
})
const editUsersError = (error) => ({
    type: EDITUSERSERROR,
    payload: error
})
//edit user permissions
export function editPermissionUsersAction(permissions,user) {
    return async (dispatch) => {
        dispatch( editPermissionUsers() );
        try {
            user.permissions = permissions;
            const RequesterId = sessionStorage.getItem('RequesterId')
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const data = {
                RequesterId:RequesterId,
                UserId:user.id,
                Permissions : permissions
            }
            backendJona.put(`/users/UpdatePermissions`,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                dispatch( editPermissionUsersSuccess(user) )
                //dispatch( createUsersSuccess(response.data) )
            }).catch(function (error) {
                dispatch( editPermissionUsersError() )
            });
        } catch (error) {
            dispatch( editPermissionUsersError() )
        }
    }
}
const editPermissionUsers = () => ({
    type: EDITPERMISSIONSUSERS
})
const editPermissionUsersSuccess = (user) => ({
    type: EDITPERMISSIONSUSERSSUCCESS,
    payload: user
})
const editPermissionUsersError = () => ({
    type: EDITPERMISSIONSUSERSERROR
})
//delete users
export function deleteUsersAction(usersId,index) {
    return async (dispatch) => {
        dispatch( deleteUsers() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.delete(`/users/DeleteUser?RequesterId=${RequesterId}&UserId=${usersId[index]}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                },data:{
                    ClaimId : RequesterId,
                    UserId : usersId[index]
                }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    index++;
                    if ( index > usersId.length - 1) {
                            dispatch(deleteUsersSuccess(usersId))
                    }else{
                        dispatch(deleteUsersAction(usersId,index))
                    }
                    //dispatch( deleteUsersSuccess(id) )
                }else{
                    dispatch( deleteUsersError() )
                }
            }).catch(function (error) {
                dispatch( deleteUsersError() )
            });
        } catch (error) {
            dispatch( deleteUsersError() )
        }
    }
}
const deleteUsers = () => ({
    type: DELETEUSER
})
const deleteUsersSuccess = (usersId) => ({
    type: DELETEUSERSUCCESS,
    payload : usersId
})
const deleteUsersError = () => ({
    type: DELETEUSERERROR
})
//active user
export function activeUsersAction(usersToActive,index) {
    return async (dispatch) => {
        dispatch( activeUsers() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const RequesterId = sessionStorage.getItem('RequesterId')
            const userToActive = {
                Email:usersToActive[index].Email,
                Name : usersToActive[index].Name,
                Active: true,
                Roles:usersToActive[index].Roles,
                Type:usersToActive[index].Type
            }
            backendJona.put(`/users/UpdateUser?RequesterId=${RequesterId}&UserId=${usersToActive[index].id}&AccountOwnerUser=${usersToActive[index].accountId}`,
            userToActive,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    index++;
                    if ( index > usersToActive.length - 1) {
                            dispatch(activeUsersSuccess(usersToActive))
                    }else{
                        dispatch(activeUsersAction(usersToActive,index))
                    }
                }else{
                    dispatch( activeUsersError() )
                }
            }).catch(function (error) {
                dispatch( activeUsersError() )
            });
        } catch (error) {
            dispatch( activeUsersError() )
        }
    }
}
const activeUsers = () => ({
    type: ACTIVEUSERS
})
const activeUsersSuccess = (usersToActive) => ({
    type: ACTIVEUSERSSUCCESS,
    payload : usersToActive
})
const activeUsersError = () => ({
    type: ACTIVEUSERSERROR
})
//GET GPSMODELS
export function getGpsModelsAction(id) {
    return async (dispatch) => {
        dispatch( getGpsModels() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.get(`/Admin/GpsModels?RequesterId=${RequesterId}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch( getGpsModelsSuccess(response.data) )
                }else{
                    dispatch( getGpsModelsError() )
                }
            }).catch(function (error) {
                dispatch( getGpsModelsError() )
            });
        } catch (error) {
            dispatch( getGpsModelsError() )
        }
    }
}
const getGpsModels = () => ({
    type: GETGPSMODELS
})
const getGpsModelsSuccess = (gps) => ({
    type: GETGPSMODELSSUCCESS,
    payload : gps
})
const getGpsModelsError = () => ({
    type: GETGPSMODELSERROR
})
//forgot password
export function forgotPasswordAction(email) {
    return async (dispatch) => {
        dispatch( forgotPassword() );
        try {
            backendJona.post(`/users/forgotpassword?Email=${email}`
            ).then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch( forgotPasswordSuccess() )
                }else{
                    dispatch( forgotPasswordError() )
                }
            }).catch(function (error) {
                if (error.response.status === 404) {
                    dispatch( forgotPasswordError("Correo invalido") )
                }else{
                    dispatch( forgotPasswordError("Error inesperado") )
                }
            });
        } catch (error) {
            dispatch( forgotPasswordError() )
        }
    }
}
const forgotPassword = () => ({
    type: FORGOTPASSWORD
})
const forgotPasswordSuccess = () => ({
    type: FORGOTPASSWORDSUCCESS
})
const forgotPasswordError = (error) => ({
    type: FORGOTPASSWORDERROR,
    payload:error
})
//reset password
export function resetPasswordAction(Token,Password,ConfirmPassword) {
    return async (dispatch) => {
        dispatch( resetPassword() );
        try {
            backendJona.post(`/users/resetpassword`,{
                Token,Password,ConfirmPassword
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch( resetPasswordSuccess() )
                }else{
                    dispatch( resetPasswordError() )
                }
            }).catch(function (error) {
                dispatch( resetPasswordError(error.response.data) )
            });
        } catch (error) {
            dispatch( resetPasswordError() )
        }
    }
}
const resetPassword = () => ({
    type: RESETPASSWORD
})
const resetPasswordSuccess = () => ({
    type: RESETPASSWORDSUCCESS
})
const resetPasswordError = (error) => ({
    type: RESETPASSWORDERROR,
    payload: error
})
//
//GET GPSMODELS
export function getAccountRolesAction(AccountId) {
    return async (dispatch) => {
        dispatch( getAccountRoles() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.get(`/Admin/GpsModels?RequesterId=${RequesterId}&AccountId=${AccountId}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch( getAccountRolesSuccess(response.data) )
                }else{
                    dispatch( getAccountRolesError() )
                }
            }).catch(function (error) {
                dispatch( getAccountRolesError() )
            });
        } catch (error) {
            dispatch( getAccountRolesError() )
        }
    }
}
const getAccountRoles = () => ({
    type: GETGPSMODELS
})
const getAccountRolesSuccess = (gps) => ({
    type: GETGPSMODELSSUCCESS,
    payload : gps
})
const getAccountRolesError = () => ({
    type: GETGPSMODELSERROR
})
//
export function changeStateUser(){
    return (dispatch) => {
        dispatch({
            type: CHANGESTATE
        })
    }
}