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
    CHANGESTATE,
    RESETPASSWORD,
    RESETPASSWORDSUCCESS,
    RESETPASSWORDERROR,
    ACTIVEUSERS,
    ACTIVEUSERSSUCCESS,
    ACTIVEUSERSERROR,
} from '../types';

const initialState = {
    user : undefined,
    users : [],
    userTypes : [{id:1,name:"Root"},{id:2,name:"Account_Manager "},{id:3,name:"Account_User"}],
    userLanguages : [{id:'es',name:"Español"},{id:'en',name:"Ingles"}],
    userUnitSystem : [{id:1,name:"Metrico"},{id:2,name:"Ingles"}],
    userLanguage : 'en',
    gpsModels : undefined,
    login: false,
    logout:false,
    loading : false,
    error:false,
    errorMessage:'',
    success:false,
    successMessage:'',
    permissions : [],
    services : [],
    userType : 3
}
export default function usuarioReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return{
                ...state,
                login:false,
                loading: true,
                logout:false,
            }
        case LOGINSUCCESS:
            return{
                ...state,
                login:true,
                loading: false,
                user: action.payload
            }
        case LOGINERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage : action.payload,
            }
        case LOGOUT:
            return{
                ...state,
                login:true,
                loading: true
            }
        case LOGOUTSUCCESS:
            return{
                ...state,
                login:false,
                loading: false,
                user : undefined,
                loading : false,
                logout:true,
            }
        case LOGOUTERROR:
            return{
                ...state,
                login: true,
                loading: false
            }
        case GETUSER:
            return{
                ...state,
                loading: true
            }
        case GETUSERSUCCESS:
            return{
                ...state,
                loading: false,
                user: action.payload,
                userTypes: action.payload.type === 1 ? [{id:1,name:"Root"},{id:2,name:"Administrador de cuentas"},{id:3,name:"Usuario"}] : (action.payload.type === 2 ? [{id:2,name:"Administrador de cuentas"},{id:3,name:"Usuario"}] : [{id:3,name:"Usuario"}]),
                permissions : action.permissions,
                services : action.services,
                userType : action.payload.type,
                userLanguage : action.payload.profile !== "ND"?
                                JSON.parse(action.payload.profile).find(item => item.type === "userLanguage") ?
                                    JSON.parse(action.payload.profile).find(item => item.type === "userLanguage").value : 'en'
                                :
                                'en'
            }
        case GETUSERERROR:
            return{
                ...state,
                loading: false
            }
        case REFRESHTOKEN:
            return{
                ...state,
                loading: true
            }
        case REFRESHTOKENSUCCESS:
            return{
                ...state,
                loading: false
            }
        case REFRESHTOKENERROR:
            return{
                ...state,
                loading: false
            }
        case GETUSERS:
            return{
                ...state,
                loading: true
            }
        case GETUSERSSUCCESS:
            return{
                ...state,
                loading: false,
                users: action.payload.filter(user => user.userType >= state.user.type)
            }
        case GETUSERSERROR:
            return{
                ...state,
                loading: false
            }
        case CREATEUSERS:
            return{
                ...state,
                loading: true
            }
        case CREATEUSERSSUCCESS:
            return{
                ...state,
                loading: false,
                success:true,
                successMessage:'Creación de usuario con exito'
            }
        case CREATEUSERSERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al crear usuario',
            }
        case EDITUSERS:
            return{
                ...state,
                loading: true
            }
        case EDITUSERSSUCCESS:
            return{
                ...state,
                loading: false,
                users: state.users.map(user =>
                    user.id === action.payload.id ? user = action.payload : user
                ),
                user : state.user.id === action.payload.id ? action.payload : state.user,
                success:true,
                successMessage:'Usuario actualizado'
            }
        case EDITUSERSERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage: action.payload? action.payload : 'Error al actualizar usuario',
            }
        case EDITPERMISSIONSUSERS:
            return{
                ...state,
                loading: true
            }
        case EDITPERMISSIONSUSERSSUCCESS:
            return{
                ...state,
                loading: false,
                users: state.users.map(user =>
                    user.id === action.payload.id ? user = action.payload : user
                )
            }
        case EDITPERMISSIONSUSERSERROR:
            return{
                ...state,
                loading: false
            }
        case DELETEUSER:
            return{
                ...state,
                loading: true
            }
        case DELETEUSERSUCCESS:
            return{
                ...state,
                loading: false,
                users: state.users.map(user => {
                    if(action.payload.find(userT => user.id === userT))
                        user.active = false
                    return user
                } ),
                success:true,
                successMessage:'Usuarios eliminados'
            }
        case DELETEUSERERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'El usuario no pudo ser eliminado',
            }
        case GETGPSMODELS:
            return{
                ...state,
                loading: true
            }
        case GETGPSMODELSSUCCESS:
            return{
                ...state,
                loading: false,
                gpsModels: action.payload
            }
        case GETGPSMODELSERROR:
            return{
                ...state,
                loading: false
            }
        case FORGOTPASSWORD:
            return{
                ...state,
                loading: true
            }
        case FORGOTPASSWORDSUCCESS:
            return{
                ...state,
                loading: false,
                success:true,
                successMessage:'Se envio correo de recuperación de contraseña correctamente'
            }
        case FORGOTPASSWORDERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage: `Error al enviar correo : ${action.payload}`,
            }
        case RESETPASSWORD:
            return{
                ...state,
                loading: true
            }
        case RESETPASSWORDSUCCESS:
            return{
                ...state,
                loading: false,
                success:true,
                successMessage:'Contraseña restablecida'
            }
        case RESETPASSWORDERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:`Error al restablecer la contraseña : ${action.payload}`,
            }
        case ACTIVEUSERS:
            return{
                ...state,
                loading: true
            }
        case ACTIVEUSERSSUCCESS:
            return{
                ...state,
                loading: false,
                users: state.users.map(currentUser => {
                    if(action.payload.find(userT => userT.id === currentUser.id)){
                        currentUser.active = true;
                    }
                    return currentUser;
                }),
                success:true,
                successMessage:'Usuarios activados'
            }
        case ACTIVEUSERSERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage: `Error al activar usuario`,
            }
        case CHANGESTATE:
            return{
                ...state,
                error:false,
                errorMessage:'',
                success:false,
                successMessage:''
            }
        default:
            return state;
    }
}