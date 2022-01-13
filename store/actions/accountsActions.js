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
import backendJona from "../../services/api";

//action para obtener cuentas
export function getAccountsAction() {
    return async (dispatch) => {
        dispatch( getAccounts() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.get(`/Accounts/GetAccounts?RequesterId=${localStorage_RequesterId}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    dispatch( getAccountsSuccess(response.data) )
                    //getServicesAction(dispatch)
                }else{
                    dispatch( getAccountsError() )
                }
            }).catch(function (error) {
                dispatch( getAccountsError() )
            });
        }catch (error) {
            dispatch( getAccountsError() )
        }
    }
}
const getAccounts = () => ({
    type: GETACCOUNTS
})
const getAccountsSuccess = (accounts) => ({
    type: GETACCOUNTSSUCCESS,
    payload : accounts
})
const getAccountsError = () => ({
    type: GETACCOUNTSERROR
})

const getServicesAction = (dispatch) => {
    dispatch( getServices() );
    try {
        const localStorage_accessToken = sessionStorage.getItem('accessToken')
        const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
        backendJona.get(`/Admin/CatalogServicesPermissions?RequesterId=${localStorage_RequesterId}`,{
            headers: {
                'Authorization': `Bearer ${localStorage_accessToken}`
            }
        }).then(response => {
            if (response.status === 200) {
                dispatch( getServicesSuccess(response.data) )

            }else{
                dispatch( getServicesError() )
            }
        }).catch(function (error) {
            dispatch( getServicesError() )
        });
    } catch (error) {
        dispatch( getServicesError() )
    }
}
export const getGlobalServicesAction = () => {
    return async (dispatch) => {
        dispatch( getServices() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.get(`/Admin/CatalogServicesPermissions?RequesterId=${localStorage_RequesterId}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200) {
                    dispatch( getServicesSuccess(response.data) )
                }else{
                    dispatch( getServicesError() )
                }
            }).catch(function (error) {
                dispatch( getServicesError() )
            });
        } catch (error) {
            dispatch( getServicesError() )
        }
    }
}
const getServices = () => ({
    type: GETSERVICES
})
const getServicesSuccess = (services) => ({
    type: GETSERVICESSUCCESS,
    payload : services
})
const getServicesError = () => ({
    type: GETSERVICESERROR
})
//update
export function upodateAccountsAction(dataAccount) {
    return async (dispatch) => {
        dispatch( upodateAccounts() );
        try {
            const RequesterId = sessionStorage.getItem('RequesterId')
            if (dataAccount.flagChangeInformationAccount) {
                //si cambio el objeto account
                const newAccount = {
                        name : dataAccount.newAccount.name,
                        description : dataAccount.newAccount.description,
                        externalId : dataAccount.newAccount.externalId,
                        odooId : dataAccount.newAccount.odooId,
                        type : dataAccount.newAccount.type,
                        status: 1,
                        Active: dataAccount.newAccount.Active
                }
                const localStorage_accessToken = sessionStorage.getItem('accessToken')
                backendJona.put(`/Accounts/UpdateAccount?RequesterId=${RequesterId}&AccountId=${dataAccount.account.id}`,
                newAccount,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage_accessToken}`
                    }
                }).then(response => {
                    if (response.status === 200) {
                        //update limpio
                        if(dataAccount.flagChangeServicesAccount){
                            updateServiceAccountAction(dispatch,dataAccount,0)
                        }else{
                            //
                            let accountToSave = dataAccount.account;
                            accountToSave.name = dataAccount.newAccount.name;
                            accountToSave.description = dataAccount.newAccount.description;
                            accountToSave.externalId = dataAccount.newAccount.externalId;
                            accountToSave.odooId = dataAccount.newAccount.odooId;
                            accountToSave.type = dataAccount.newAccount.type;
                            dispatch( upodateAccountsSuccess(accountToSave) )
                        }
                    }else{
                        dispatch( upodateAccountsError() )
                    }
                }).catch(function (error) {
                    dispatch( upodateAccountsError() )
                });
            } else {
                if (dataAccount.flagChangeServicesAccount) {
                    updateServiceAccountAction(dispatch,dataAccount,0)
                }else{
                    upodateAccountsError()
                }
            }
        } catch (error) {
            dispatch( upodateAccountsError() )
        }
    }
}
const addServiceAccount = (dispatch,servicesTo_addServiceAccount,servicesTo_activeServiceAccount,servicesTo_desactiveServiceAccount,AccountId,index) =>{
    if ( index < servicesTo_addServiceAccount.length ) {
        const RequesterId = sessionStorage.getItem('RequesterId')
        const service = servicesTo_addServiceAccount[index];
        const newServicesAccount = {
            CatalogId : service.serviceId,
            Name : service.serviceName,
            Description : service.serviceDescription,
            Active : true,
            PermisesOfService : service.permissions.map(permission => {
                const positionEnd = permission.permissionName.indexOf("_");
                let namePer = permission.permissionName;
                if (positionEnd > 0) {
                    namePer = permission.permissionName.slice(0, positionEnd);
                }
                return{
                    CatalogId : permission.permissionId,
                    DisplayName : permission.permissionName,
                    Name : namePer,
                    Description : permission.description
                }
            })
        }
        const localStorage_accessToken = sessionStorage.getItem('accessToken')
        backendJona.post(`/Accounts/AddAccountService?RequesterId=${RequesterId}&AccountId=${AccountId}`,
        newServicesAccount,
        {
            headers: {
                'Authorization': `Bearer ${localStorage_accessToken}`
            }
        }).then(response => {
            index++;
            if ( index < servicesTo_addServiceAccount.length ) {
                addServiceAccount(dispatch,servicesTo_addServiceAccount,servicesTo_activeServiceAccount,servicesTo_desactiveServiceAccount,AccountId,index)
            }else{
                //siguiente funcion -activeServiceAccount
                activeServiceAccount(dispatch,servicesTo_activeServiceAccount,servicesTo_desactiveServiceAccount,AccountId,0)
            }
            //dispatch( createAccountsSuccess(response.data) )
        }).catch(function (error) {
            dispatch( upodateAccountsError() )
        });
    }else{
        //siguiente funcion -activeServiceAccount
        activeServiceAccount(dispatch,servicesTo_activeServiceAccount,servicesTo_desactiveServiceAccount,AccountId,0)
    }
}
const activeServiceAccount = (dispatch,servicesTo_activeServiceAccount,servicesTo_desactiveServiceAccount,AccountId,index) =>{
    if ( index < servicesTo_activeServiceAccount.length ) {
        const RequesterId = sessionStorage.getItem('RequesterId')
        const service = servicesTo_activeServiceAccount[index];
        const updateServicesAccount = {
            AccountId:AccountId,
            ServiceId:service.id,
            Status : true
        }
        const localStorage_accessToken = sessionStorage.getItem('accessToken')
        backendJona.put(`/Accounts/UpdateServiceStatus?RequesterId=${RequesterId}`,
        updateServicesAccount,
        {
            headers: {
                'Authorization': `Bearer ${localStorage_accessToken}`
            }
        }).then(response => {
            index++;
            if ( index < servicesTo_activeServiceAccount.length ) {
                activeServiceAccount(dispatch,servicesTo_activeServiceAccount,servicesTo_desactiveServiceAccount,AccountId,index)
            }else{
                //siguiente funcion -desactiveServiceAccount
                desactiveServiceAccount(dispatch,servicesTo_desactiveServiceAccount,AccountId,0)
            }
        })
    }else{
        //siguiente funcion -desactiveServiceAccount
        desactiveServiceAccount(dispatch,servicesTo_desactiveServiceAccount,AccountId,0)
    }
}
const desactiveServiceAccount = (dispatch,servicesTo_desactiveServiceAccount,AccountId,index) =>{
    if ( index < servicesTo_desactiveServiceAccount.length ) {
        const RequesterId = sessionStorage.getItem('RequesterId')
        const service = servicesTo_desactiveServiceAccount[index];
        const updateServicesAccount = {
            AccountId:AccountId,
            ServiceId:service.id,
            Status : false
        }
        const localStorage_accessToken = sessionStorage.getItem('accessToken')
        backendJona.put(`/Accounts/UpdateServiceStatus?RequesterId=${RequesterId}`,
        updateServicesAccount,
        {
            headers: {
                'Authorization': `Bearer ${localStorage_accessToken}`
            }
        }).then(response => {
            index++;
            if ( index < servicesTo_desactiveServiceAccount.length ) {
                desactiveServiceAccount(dispatch,servicesTo_desactiveServiceAccount,AccountId,index)
            }else{
                //fin - get accountbyId
                getAccountById(dispatch,AccountId)
            }
        }).catch(function (error) {
            dispatch( upodateAccountsError() )
        });
    }else{
        //fin - get accountbyId
        getAccountById(dispatch,AccountId)
    }
}

const getAccountById = (dispatch,AccountId) => {
    const localStorage_accessToken = sessionStorage.getItem('accessToken')
    const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
    backendJona.get(`/Accounts/GetAccountById?RequesterId=${localStorage_RequesterId}&AccountId=${AccountId}`,{
        headers: {
            'Authorization': `Bearer ${localStorage_accessToken}`
        }
    }).then(response => {
        if (response.status === 200) {
            dispatch( upodateAccountsSuccess(response.data));
        }else{
            dispatch( upodateAccountsError() )
        }
    }).catch(function (error) {
        dispatch( upodateAccountsError() )
    });
}
export const getAccountByIdAction = (AccountId) => {
    return async (dispatch) => {
        dispatch( getAccountByIdResult() );
        try {
            const RequesterId = sessionStorage.getItem('RequesterId')
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            backendJona.get(`/Accounts/GetAccountById?RequesterId=${RequesterId}&AccountId=${AccountId}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                dispatch( getAccountByIdSuccess(response.data) )
            }).catch(function (error) {
                dispatch( getAccountByIdError() )
            });
        } catch (error) {
            dispatch( getAccountByIdError() )
        }
    }
}
const getAccountByIdResult = () => ({
    type: GETACCOUNT
})
const getAccountByIdSuccess = (account) => ({
    type: GETACCOUNTSUCCESS,
    payload : account
})
const getAccountByIdError = () => ({
    type: GETACCOUNTERROR
})
const updateServiceAccountAction = (dispatch,dataAccount,index) => {
    const newServices = dataAccount.newServices;
    const oldServices = dataAccount.account.accountServices;
    const servicesTo_addServiceAccount = newServices.filter(newService => ( !oldServices.find(oldService => oldService.catalogId === newService.serviceId)) );
    const servicesTo_activeServiceAccount = oldServices.filter(oldService => ( newServices.find(newService => oldService.catalogId === newService.serviceId && oldService.active !== newService.active) ) );
    const servicesTo_desactiveServiceAccount = oldServices.filter(oldService => ( !newServices.find(newService => oldService.catalogId === newService.serviceId) ) );
    /**aqui modificamos el objecto de dataAccount para que quede como debe ser */
    addServiceAccount(dispatch,servicesTo_addServiceAccount,servicesTo_activeServiceAccount,servicesTo_desactiveServiceAccount,dataAccount.account.id,0)
}
const upodateAccounts = () => ({
    type: UPDATEACCOUNTS
})
const upodateAccountsSuccess = (account) => ({
    type: UPDATEACCOUNTSSUCCESS,
    payload : account
})
const upodateAccountsError = () => ({
    type: UPDATEACCOUNTSERROR
})
//create
export function createAccountsAction(account) {
    return async (dispatch) => {
        dispatch( createAccounts() );
        try {
            const RequesterId = sessionStorage.getItem('RequesterId')
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            backendJona.post(`/Accounts/CreateAccount?RequesterId=${RequesterId}`,
            account,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                dispatch( createAccountsSuccess(response.data) )
            }).catch(function (error) {
                console.log(error.response)
                if(error.response){
                    dispatch( createAccountsError(error.response.data) )
                }else{
                    dispatch( createAccountsError("Error al crear la cuenta") )
                }
            });
        } catch (error) {
            dispatch( createAccountsError("Error al crear la cuenta") )
        }
    }
}
const createAccounts = () => ({
    type: CREATEACCOUNTS
})
const createAccountsSuccess = (account) => ({
    type: CREATEACCOUNTSSUCCESS,
    payload : account
})
const createAccountsError = (error) => ({
    type: CREATEACCOUNTSERROR,
    payload: error
})
//delete
export function deleteAccountsAction(accounts,index) {
    return async (dispatch) => {
        dispatch( deleteAccounts() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.delete(`/Accounts/DeleteAccount?RequesterId=${RequesterId}&AccountId=${accounts[index]}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch( deleteAccountsSuccess(accounts[index]) )
                    index++;
                    if ( index > accounts.length - 1) {
                        accounts.forEach(element => {
                            dispatch(deleteAccountsSuccess(element))
                        });
                    }else{
                        dispatch(deleteAccountsAction(accounts,index))
                    }
                }else{
                    dispatch( deleteAccountsError() )
                }
            }).catch(function (error) {
                dispatch( deleteAccountsError() )
            });
        } catch (error) {
            dispatch( deleteAccountsError() )
        }
    }
}
const deleteAccounts = () => ({
    type: DELETEACCOUNTS
})
const deleteAccountsSuccess = (id) => ({
    type: DELETEACCOUNTSSUCCESS,
    payload : id
})
const deleteAccountsError = () => ({
    type: DELETEACCOUNTSERROR
})
//active
export function activeAccountsAction(accounts,index) {
    return async (dispatch) => {
        dispatch( activeAccounts() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.put(`/Accounts/UpdateAccount?RequesterId=${RequesterId}&AccountId=${accounts[index].id}`,
            accounts[index],{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    index++;
                    if ( index > accounts.length - 1) {
                            dispatch(activeAccountsSuccess(accounts))
                    }else{
                        dispatch(activeAccountsAction(accounts,index))
                    }
                }else{
                    dispatch( activeAccountsError() )
                }
            }).catch(function (error) {
                dispatch( activeAccountsError() )
            });
        } catch (error) {
            dispatch( activeAccountsError() )
        }
    }
}
const activeAccounts = () => ({
    type: ACTIVEACCOUNTS
})
const activeAccountsSuccess = (accounts) => ({
    type: ACTIVEACCOUNTSSUCCESS,
    payload : accounts
})
const activeAccountsError = () => ({
    type: ACTIVEACCOUNTSERROR
})
//create role
export function createAccountsRoleAction(account,newRole) {
    return async (dispatch) => {
        dispatch( createAccountsRole() );
        try {
            const RequesterId = sessionStorage.getItem('RequesterId')
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const accountRes = account;
            backendJona.post(`/Accounts/AddAccountRole?RequesterId=${RequesterId}&AccountId=${account.id}`,
            newRole,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    const newRolresponse = response.data;
                    newRolresponse.focusOn = true;
                    newRolresponse.accountId = accountRes.id;
                    newRolresponse.RolesPermissions = [];
                    //newRole.role_Id = newRolresponse.role_Id;
                    //newRolresponse.accountId = account.id;
                    //accountRes.AccountId = account.id;
                    accountRes.accountRoles.push(newRolresponse)
                    accountRes.name="tacos"
                    dispatch( createAccountsRoleSuccess(accountRes) )
                }else{
                    dispatch( createAccountsRoleError() )
                }
            }).catch(function (error) {
                dispatch( createAccountsRoleError() )
            });
        } catch (error) {
            dispatch( createAccountsRoleError() )
        }
    }
}
const createAccountsRole = () => ({
    type: CREATEACCOUNTROLE
})
const createAccountsRoleSuccess = (account) => ({
    type: CREATEACCOUNTROLESSUCCESS,
    payload : account
})
const createAccountsRoleError = () => ({
    type: CREATEACCOUNTROLEERROR
})
//update role
export function updateAccountsRoleAction(role,account) {
    return async (dispatch) => {
        dispatch( updateAccountsRole() );
        try {
            const RequesterId = sessionStorage.getItem('RequesterId')
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            backendJona.put(`/Accounts/UpdateAccountRole?RequesterId=${RequesterId}&AccountId=${account.id}&RoleId=${role.RoleId}`,
            role,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch( updateAccountsRoleSuccess() )
                }else{
                    dispatch( updateAccountsRoleError() )
                }
            }).catch(function (error) {
                dispatch( updateAccountsRoleError() )
            });
        } catch (error) {
            dispatch( updateAccountsRoleError() )
        }
    }
}
const updateAccountsRole = () => ({
    type: UPDATEACCOUNTROLE
})
const updateAccountsRoleSuccess = () => ({
    type: UPDATEACCOUNTROLESSUCCESS
})
const updateAccountsRoleError = () => ({
    type: UPDATEACCOUNTROLEERROR
})
//action para obtener servicios
export function getServicesAccountAction() {
    return async (dispatch) => {
        dispatch( getServicesAccount() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.get(`/Admin/CatalogServicesPermissions?RequesterId=${localStorage_RequesterId}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200) {
                    dispatch( getServicesAccountSuccess(response.data) )
                }else{
                    dispatch( getServicesAccountError() )
                }
            }).catch(function (error) {
                dispatch( getServicesAccountError() )
            });
        }catch (error) {
            dispatch( getServicesAccountError() )
        }
    }
}
const getServicesAccount = () => ({
    type: GETSERVICES
})
const getServicesAccountSuccess = (accounts) => ({
    type: GETSERVICESSUCCESS,
    payload : accounts
})
const getServicesAccountError = () => ({
    type: GETSERVICESERROR
})
//
export function changeState(){
    return (dispatch) => {
        dispatch({
            type: CHANGESTATE
        })
    }
}