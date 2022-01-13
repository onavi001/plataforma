import {
    GETACCOUNTS,
    GETACCOUNTSSUCCESS,
    GETACCOUNTSERROR,
    UPDATEACCOUNTS,
    UPDATEACCOUNTSSUCCESS,
    UPDATEACCOUNTSERROR,
    CREATEACCOUNTS,
    CREATEACCOUNTSSUCCESS,
    CREATEACCOUNTSERROR,
    DELETEACCOUNTS,
    DELETEACCOUNTSSUCCESS,
    DELETEACCOUNTSERROR,
    UPDATEACCOUNTROLE,
    UPDATEACCOUNTROLESSUCCESS,
    UPDATEACCOUNTROLEERROR,
    CREATEACCOUNTROLE,
    CREATEACCOUNTROLESSUCCESS,
    CREATEACCOUNTROLEERROR,
    GETSERVICES,
    GETSERVICESSUCCESS,
    GETSERVICESERROR,
    GETACCOUNT,
    GETACCOUNTSUCCESS,
    GETACCOUNTERROR,
    CHANGESTATE,
    ACTIVEACCOUNTS,
    ACTIVEACCOUNTSSUCCESS,
    ACTIVEACCOUNTSERROR,
} from '../types';

const initialState = {
    accounts: undefined,
    account: undefined,
    loading : false,
    services : undefined,
    error:false,
    errorMessage:'',
    success:false,
    successMessage:''
}
export default function accountsReducer(state = initialState, action) {
    switch (action.type) {
        case GETACCOUNTS:
            return{
                ...state,
                loading: true
            }
        case GETACCOUNTSSUCCESS:
            return{
                ...state,
                loading: false,
                accounts: action.payload,
            }
        case GETACCOUNTSERROR:
            return{
                ...state,
                loading: false,
            }
        case GETACCOUNT:
            return{
                ...state,
                loading: true
            }
        case GETACCOUNTSUCCESS:
            return{
                ...state,
                loading: false,
                account: action.payload,
            }
        case GETACCOUNTERROR:
            return{
                ...state,
                loading: false,
            }
        case UPDATEACCOUNTS:
            return{
                ...state,
                loading: true
            }
        case UPDATEACCOUNTSSUCCESS:
            return{
                ...state,
                loading: false,
                accounts: state.accounts.map(account =>{
                    if(account.id === action.payload.id){
                        account = action.payload;
                    }
                    return account;
                }
                ),
                success:true,
                successMessage:'Cuenta actualizada'
            }
        case UPDATEACCOUNTSERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Cuenta no actualizada',
            }
        case CREATEACCOUNTS:
            return{
                ...state,
                loading: true
            }
        case CREATEACCOUNTSSUCCESS:
            return{
                ...state,
                loading: false,
                accounts: [...state.accounts, action.payload],
                success:true,
                successMessage:'Cuenta creada'
            }
        case CREATEACCOUNTSERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage: action.payload//'Error al crear la cuenta',
                //An account with this ExternalId already exists.
            }
        case DELETEACCOUNTS:
            return{
                ...state,
                loading: true
            }
        case DELETEACCOUNTSSUCCESS:
            return{
                ...state,
                loading: false,
                accounts: state.accounts.map(account => {
                    if(account.id === action.payload){
                        account.active = false;
                    }
                    return account;
                }),
                success:true,
                successMessage:'Cuentas eliminadas'
            }
        case DELETEACCOUNTSERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al eliminar la cuentas',
            }
        case ACTIVEACCOUNTS:
            return{
                ...state,
                loading: true
            }
        case ACTIVEACCOUNTSSUCCESS:
            return{
                ...state,
                loading: false,
                accounts: state.accounts.map(account => {
                    if(action.payload.find(accountT => account.id === accountT.id)){
                        account.active = true;
                    }
                    return account;
                }),
                success:true,
                successMessage:'Cuentas activadas'
            }
        case ACTIVEACCOUNTSERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al activar cuentas',
            }
        case UPDATEACCOUNTROLE:
            return{
                ...state,
                loading:true
            }
        case UPDATEACCOUNTROLESSUCCESS:
            return{
                ...state,
                loading:false,
                success:true,
                successMessage:'Rol actualizado con exito'
            }
        case UPDATEACCOUNTROLEERROR:
            return{
                ...state,
                loading:false,
                error:true,
                errorMessage:'Error al actualizar rol',
            }
        case CREATEACCOUNTROLE:
            return{
                ...state,
                loading:true,
                account: undefined,
            }
        case CREATEACCOUNTROLESSUCCESS:
            return{
                ...state,
                loading:false,
                accounts: state.accounts.map(account =>
                    account.Id === action.payload.id ? account = action.payload : account
                ),
                account: action.payload
            }
        case CREATEACCOUNTROLEERROR:
            return{
                ...state,
                loading:false
            }
        case GETSERVICES:
            return{
                ...state,
                loading:true
            }
        case GETSERVICESSUCCESS:
            return{
                ...state,
                services : action.payload,
                loading:false
            }
        case GETSERVICESERROR:
            return{
                ...state,
                services:[],
                loading:false
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