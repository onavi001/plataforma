import React, { useState, useEffect } from "react";
import CardComponent from "../../../../Components/CardComponent";
import FullComponent from "../../../../Components/FullComponent";
import BasicFormComponent from "../../../../Components/BasicFormComponent";
import { useDispatch, useSelector } from 'react-redux'
import { getAccountByIdAction, getAccountsAction } from "../../../../store/actions/accountsActions"
import { getUsersAction } from "../../../../store/actions/usuarioActions"
import { editUsersAction, editPermissionUsersAction } from "../../../../store/actions/usuarioActions";
import TableComponent from "../../../../Components/TableComponent";
import HorizontalTabComponent from "../../../../Components/HorizontalTabComponent";
import Checkbox from '@material-ui/core/Checkbox';
import { abrirAlertaCampos } from "../../../../config/alerts";
import getText from "../../../../config/languages";
import { useRouter } from 'next/router'
import Link from 'next/link'
const UsersEdit = ({...pageProps}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const [ user, setUser ] = useState(undefined)
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        if(user){
            const pathname = window.location.pathname;
            let pageName = user.name;
            const prefixName = "Editar usuario";
            const flagPrincipal=false;
            if(flagPrincipal){
                sessionStorage.setItem('rout', JSON.stringify([]));
            }
            let routs = [];
            const valueRoutStorage = JSON.parse(sessionStorage.getItem('rout'));
            console.log(valueRoutStorage);
            if(valueRoutStorage){
                routs = valueRoutStorage;
                const routFound = routs.find(rout => rout.prefix === prefixName);
                if(!routFound){
                routs.push({prefix:prefixName,name:pageName,path:pathname})
                sessionStorage.setItem('rout', JSON.stringify(routs));
                }
            }else{
                routs=[{prefix:prefixName,name:pageName,path:pathname}]
                sessionStorage.setItem('rout', JSON.stringify(routs));
            }
            console.log(routs);
            const newRouts = [];
            let index = 0;
            console.log(prefixName)
            do {
                const rout = routs[index];
                console.log(rout);
                newRouts.push(rout)
                index++
            } while (index < routs.length && routs[index].prefix !== prefixName);
            if(!flagPrincipal){
                if(routs.find(rout => rout.prefix === prefixName)){
                    newRouts.push({prefix:prefixName,name:pageName,path:pathname});
                }
            }
            sessionStorage.setItem('rout', JSON.stringify(newRouts));
            //setCurrentRouts(routs)
            setTitleRouts(()=>(
            <span>
                {
                newRouts.map((rout,index)=>(
                    <Link key={`AccountsGet_Link_${index}`} href={rout.path} >
                        <a style={{margin: "-4px 0 0 5px"}} className={index !== newRouts.length - 1 ? 'currenHeaderLink' : 'headerLink'} >
                            {index > 0 ? ' / ':null}
                            {`${getText(rout.prefix,userLanguage)} ${rout.name?': '+rout.name:''}`}
                        </a>
                    </Link>
                ))
                }
            </span>
            ))
        }
    }, [user])
    const userPermissions = useSelector(state => state.usuario.permissions);
    const userUserType = useSelector(state => state.usuario.userType);
    const userServices = useSelector(state => state.usuario.services);
    const [ nameErrorState, setNameErrorState ] = useState('')
    const [ emailErrorState, setEmailErrorState ] = useState('')
    const [ passwordErrorState, setPasswordErrorState ] = useState('')
    const [ repeatPasswordErrorState, setRepeatPasswordErrorState ] = useState('')
    const [ typeErrorState, setTypeErrorState ] = useState('')
    const [ nameState, setNameState ] = useState('')
    const [ emailState, setEmailState ] = useState('')
    const [ passwordState, setPasswordState ] = useState('')
    const [ repeatPasswordState, setRepeatPasswordState ] = useState('')
    const [ typeState, setTypeState ] = useState('')
    const Titulo = getText("Editar usuario",userLanguage);
    const { id } = pageProps.router.query
    const userTypes = useSelector(state => state.usuario.userTypes);
    const [userTypesFilter,setUserTypesFilter] = useState([])
    const principalUser = useSelector(state => state.usuario.user);
    useEffect(() => {
        //Consultar la api
        if(users.length <= 0){
            const loadUsers = () => dispatch( getUsersAction() );
            loadUsers()
        }
    }, [])
    const users = useSelector(state => state.usuario.users);
    const Accounts = useSelector(state => state.accounts.accounts);
    const account = useSelector(state => state.accounts.account);
    useEffect(() => {
        if (principalUser && principalUser.type === 1) {
            const loadAccounts = () => dispatch( getAccountsAction() );
            loadAccounts()
        }
    }, [dispatch])
    useEffect(() => {
        //Consultar la api
        if (users.length > 0) {
            const currentUser = users.find(userToSet => userToSet.id === id)
            if (currentUser) {
                setUser(users.find(userToSet => userToSet.id === id))
                if (userUserType === 1 || userUserType === 2) {
                    if(!account){
                        if(id){
                            const loadAccount = () => dispatch( getAccountByIdAction(currentUser.accountId) );
                            loadAccount()
                        }
                    }else{
                        if(id){
                            if(account.id !== currentUser.accountId){
                                const loadAccount = () => dispatch( getAccountByIdAction(currentUser.accountId) );
                                loadAccount()
                            }
                        }
                    }
                }
            }
        }
    }, [dispatch, id, userUserType, users])
    useEffect(() => {
        //Consultar la api
        if (user && userTypes) {
            setNameState(user.name)
            setEmailState(user.email)
            setPasswordState('')
            setRepeatPasswordState('')
            setTypeState(user.userType)
            if (principalUser.type === 1) {
                const currentAccountUser = Accounts.find(account => account.id === user.accountId)
                if (currentAccountUser) {
                    if(currentAccountUser.type !== "Root"){
                        setUserTypesFilter(userTypes.filter(type => type.id !== 1))
                    }else{
                        setUserTypesFilter(userTypes)
                    }
                }else{
                    setUserTypesFilter(userTypes)
                }
            }else{
                setUserTypesFilter(userTypes)
            }
        }
    }, [users, user, userTypes, Accounts, principalUser.type])
    useEffect(() => {
        if (user) {
            setDataInformationComponent([
                {prop:"userName",       fileName:getText("Nombre del Usuario",userLanguage), value:nameState,             state:nameState,            setState:setNameState,          errorState:nameErrorState,          setErrorState:setNameErrorState,            infoData: getText('El nombre de usuario debe de contener al menos 8 caracteres',userLanguage) },
                {prop:"email",          fileName:getText("Email",userLanguage),              value:emailState,            state:emailState,           setState:setEmailState,         errorState:emailErrorState,         setErrorState:setEmailErrorState,           infoData: '' },
                {prop:"password",       fileName:getText("Contraseña",userLanguage),         value:passwordState,         state:passwordState,        setState:setPasswordState,      errorState:passwordErrorState,      setErrorState:setPasswordErrorState,        infoData: getText('La contraseña debe ser mayor a 8 caracteres, debe contener mayúsculas, minusculas, numero y carácter especial',userLanguage), type:"password", placeholder : "********"},
                {prop:"repeatPassword", fileName:getText("Repetir contraseña",userLanguage), value:repeatPasswordState,   state:repeatPasswordState,  setState:setRepeatPasswordState,errorState:repeatPasswordErrorState,setErrorState:setRepeatPasswordErrorState,  infoData: getText('La contraseña debe ser mayor a 8 caracteres, debe contener mayúsculas, minusculas, numero y carácter especial',userLanguage), type:"password", placeholder : "********"},
                {prop:"type",           fileName:getText("Tipo",userLanguage),               value:typeState,             state:typeState,            setState:setTypeState,          errorState:typeErrorState,          setErrorState:setTypeErrorState,            infoData: '', option:userTypesFilter.map(type => ({value:type.id,label:type.name}) ) },
            ])
        }
    }, [user, users, nameState, emailState, typeState, userTypesFilter, nameErrorState, emailErrorState, passwordState, passwordErrorState, repeatPasswordState, repeatPasswordErrorState, typeErrorState])
    //aramar componentes
    const [dataInformationComponent, setDataInformationComponent] = useState([]);
    //Validador de campos
    const validateBasicFilesCreate = (e) => {
        e.preventDefault();
        let errors = '';
        dataInformationComponent.forEach(data => {
            data.setState(data.value);
        });
        const newUser = user;
        newUser.name = dataInformationComponent[0].state;
        newUser.email = dataInformationComponent[1].state;
        newUser.userType = dataInformationComponent[4].state;
        let validatorFlag = true;
        if(newUser.name.length <= 8) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===0){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('El nombre de usuario debe de contener al menos 8 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        const emailVal = validateEmail(newUser.email)
        if(!emailVal) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===1){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Formato de correo invalido',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if(newUser.userType.length <= 0) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===4){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Campo tipo vacio',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (dataInformationComponent[2].state.length > 0) {
            if(dataInformationComponent[2].state !== dataInformationComponent[3].state) {
                setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===2){dat.errorState ='inputError';} return dat; }))
                setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===3){dat.errorState ='inputError';} return dat; }))
                errors += `<li>${getText('Contraseñas no coinciden',userLanguage)}</li>`
                validatorFlag = false;
            }else if(!validatePassword(dataInformationComponent[2].state)){
                setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===2){dat.errorState ='inputError';} return dat; }))
                setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===3){dat.errorState ='inputError';} return dat; }))
                errors += `<li>${getText('Formato de contraseña invalido',userLanguage)}</li>`
                validatorFlag = false;
            }else{
                newUser.Password=dataInformationComponent[2].state;
            }
        }
        newUser.roles = selectionModel;
        if (newUser.roles.length <= 0) {
            errors += `<li>${getText('Seleccione al menos un <strogn>Rol</strogn>',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (validatorFlag) {
            dispatch(editUsersAction(newUser))
        }else{
            abrirAlertaCampos('error',`<ul style='list-style: unset;'>${errors}</ul> `)
        }
    }
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    function validatePassword(password) {
        if(password.length < 7){
            return false;
        }else if (!password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){// If password contains both lower and uppercase characters, increase strength value.
            return false;
        }else if (!password.match(/([a-zA-Z])/) && password.match(/([0-9])/)){// If it has numbers and characters, increase strength value.
            return false;
        }else if (!password.match(/([!,%,&,@,#,$,^,*,?,_,~,.])/)){// If it has one special character, increase strength value.
            return false;
        }else{
            return true;
        }
    }
    const buttonGroupForm = [
        {
            funcion : validateBasicFilesCreate,
            nombre : getText("Guardar",userLanguage),
            icono : null,
            clase : "successButton"
        }
    ]
    //Table componente for roles
    const tableRoleComponentTitle = getText("Roles",userLanguage)
    const [ selectionModel,setSelectionModel ] = useState([])
    useEffect(() => {
        if (user) {
            if (account) {
                const roleActive = [];
                user.roles.forEach(roleUser => {
                    const roleFound = account.accountRoles.find(accountRole => accountRole.id === roleUser )
                    if (roleFound) {
                        roleActive.push(roleFound.id)
                    }
                });
                setSelectionModel(roleActive)
            }else{
                const roleActive = [];
                user.roles.forEach(roleUser => {
                        roleActive.push(roleUser)
                });
                setSelectionModel(roleActive)
            }
        }
    }, [user,account])
    useEffect(() => {
        if (user ) {
            if (account) {
                const accountRoles = account.accountRoles;
                setRowsTableRoleComponents(setInitialRows(accountRoles))
            }else{
                //const accountRoles = account.accountRoles;
                setRowsTableRoleComponents(setInitialRows(principalUser.roles))
            }
        }
    }, [account, principalUser.roles, user])
    const columnsTableRoleComponents = [
        {
            field: 'id',
            headerName: 'id',
            width: 100,
            hide: true
        },{
            field: 'name',
            headerName: getText('Nombre',userLanguage),
            width: 250,
            hide: false
        },{
            field: 'description',
            headerName: getText('Descripción',userLanguage),
            flex: 1,
            minWidth: 350,
            hide: false
        }
    ];
    const setInitialRows = (accountRoles) => {
        let rowsServiceComponents = accountRoles.map(role => {
            return {
                id : role.id,
                name : role.name,
                description : role.description,
            }
        })
        return rowsServiceComponents;
    }
    const closeComponent = (e) => {
        e.preventDefault();
        if (account) {
            router.push(`/accounts/${account.id}`);
        }else{
            router.push(`/account/${user.accountId}`);
        }
    }
    const buttonGroupFooter = [
        {
            funcion : closeComponent,
            nombre : getText("Cerrar",userLanguage),
            icono : null,
            clase : "neutroButton"
        }
    ]
    const [rowsTableRoleComponents, setRowsTableRoleComponents ] = useState([])
    //tablePermisionComponent
    const ActionCellComponent = ({ params,permissions,services }) => {
        const elRefchecked = React.useRef();
        const [checkboxState, setCheckboxState] = useState(false)
        const [showCheckbox, setShowCheckbox] = useState(true);
        useEffect(() => {
            if (!params.row[params.field]) {
                setShowCheckbox(false)
            }
        }, [params.field, params.row])
        useEffect(() => {
            const serviceId = params.id;
                const permissionName = params.field;
                const permissionFound = permissions.find(permission => permission.serviceId === serviceId && permission.name === permissionName)
                if (permissionFound) {
                    const permissionExist = selectCheckBoxPermission.find(permissionArray => permissionArray === permissionFound.id);
                    if (permissionExist) {
                        setCheckboxState(true)
                    }
                }
        }, [params.field, params.id, permissions])
        const handleSeeClick = (e) =>{
            e.preventDefault()
            const currentStateCheckBox = !checkboxState
            setCheckboxState(currentStateCheckBox)
            let permissionArray = selectCheckBoxPermission;
            if (currentStateCheckBox) {
                const serviceId = params.id;
                const permissionName = params.field;
                const permissionFound = permissions.find(permission => permission.serviceId === serviceId && permission.name === permissionName)
                if (permissionFound) {
                    const permissionExist = permissionArray.find(permissionArray => permissionArray === permissionFound.id);
                    if (!permissionExist) {
                        permissionArray.push(permissionFound.id)
                        setSelectCheckBoxPermission(permissionArray)
                    }
                }
            }else{
                const serviceId = params.id;
                const permissionName = params.field;
                const permissionFound = permissions.find(permission => permission.serviceId === serviceId && permission.name === permissionName)
                if (permissionFound) {
                    const permissionExist = permissionArray.find(permissionArray => permissionArray === permissionFound.id);
                    if (permissionExist) {
                        permissionArray = permissionArray.filter(permissionArray => permissionArray !== permissionFound.id)
                        setSelectCheckBoxPermission(permissionArray)
                    }
                }
            }
        }
        return (
            <>
                <div>
                    {
                        showCheckbox ?
                            <Checkbox
                                ref={elRefchecked}
                                checked={checkboxState}
                                onClick={e => handleSeeClick(e)}
                                color="primary"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        :
                            "N/A"
                    }
                </div>
            </>
        );
    };
    const [ columnsPermissionComponent, setColumnsPermissionComponent ] = useState([])
    const [ rowsPermissionComponent, setRowsPermissionComponent ] = useState([])
    const [ selectCheckBoxPermission, setSelectCheckBoxPermission ] = useState([])
    useEffect(() => {
        if (user) {
            user.permissions = selectCheckBoxPermission
            tempoFunct()
            //setUser(user)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectCheckBoxPermission])
    useEffect(() => {
        if (user) {
            tempoFunct()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account,user])
    const tempoFunct = () => {
        if (account) {
            setSelectCheckBoxPermission(user.permissions)
            const services = account.accountServices;
            const permissions = account.accountPermissions ? account.accountPermissions : [];
            const colums = createColumns(permissions,services)
            setColumnsPermissionComponent(colums)
            const rows = createRows(permissions,services)
            setRowsPermissionComponent(rows)
        }else{
            setSelectCheckBoxPermission(user.permissions)
            const colums = createColumns()
            setColumnsPermissionComponent(colums)
            const rows = createRows()
            setRowsPermissionComponent(rows)
        }
    }
    const [ selectionModelPermission,setSelectionModelPermission ] = useState([])
    const createRows = (permissions=userPermissions,services=userServices) =>{
        const rows = services.map(service => {
            let rowTemp = permissions.filter(permission => permission.serviceId === service.id )
            rowTemp = rowTemp.map(permission => ( {[permission.name] : permission.name}) )
            rowTemp.unshift({id:service.id},{svc:getText(service.name,userLanguage)})
            const rowTemporal = {};
            rowTemp.forEach(element => { rowTemporal[Object.keys(element)[0]] = element[Object.keys(element)[0]] });
            return rowTemporal;
        })
        return rows;
    }
    const createColumns = (permissions=[],services=[]) => {
        const headersServiceAccount = [];
        if (userUserType === 2 || userUserType === 3) {
            userPermissions.forEach(AccountPermission => {
                console.log(userServices)
                const found = userServices.find(hsa => hsa === AccountPermission.name)
                if (found) {
                } else {
                    headersServiceAccount.push(AccountPermission.name)
                }
            });
            //userPermissions
            //userServices
        }else if(userUserType === 1) {
            permissions.forEach(AccountPermission => {
                const found = headersServiceAccount.find(hsa => hsa === AccountPermission.name)
                if (found) {
                } else {
                    headersServiceAccount.push(AccountPermission.name)
                }
            });
        }
        const columns = headersServiceAccount.map(header => {
            header = {
                field: header,
                headerName: getText(header,userLanguage),
                sortable: false,
                width: 125,
                hide: false,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    return (
                        <div style={{ cursor: "pointer",display: "contents" }} >
                            <ActionCellComponent params={params} permissions={permissions} services={services} />
                        </div>
                    );
                }
            }
            return header;
        });
        columns.unshift({
            field: 'id',
            headerName: 'id',
            width: 100,
            hide: true
        },{
            field: 'svc',
            headerName: getText('Servicios',userLanguage),
            flex: 1,
            minWidth: 150,
            hide: false
        })
        return columns;
    }
    const editPermissionsUsers = (e) => {
        e.preventDefault();
        dispatch(editPermissionUsersAction(selectCheckBoxPermission,user))
    }
    const buttonGroupUserPermission = [
        {
            funcion : editPermissionsUsers,
            nombre : getText("Guardar",userLanguage),
            icono : null,
            clase : "successButton"
        }
    ]
    //componente principal
    const [dataHorizontalComponent, setDataHorizontalComponent] = useState([])
    useEffect(() => {
        setDataHorizontalComponent([
            {
                label:getText("Información del usuario",userLanguage),
                body:(
                    <CardComponent
                        Titulo={Titulo}
                        Body={BasicFormComponent}
                        classComponent="bodyUserEdit"
                        //margin-top: 10px;
                        data={dataInformationComponent}
                        setData={setDataInformationComponent}
                        buttonGroupPage={buttonGroupForm}
                        buttonGroupFooter={[]}
                    />
                )
            },{
                label:getText("Roles",userLanguage),
                body:(
                    <FullComponent
                        Titulo={tableRoleComponentTitle}
                        Body={TableComponent}
                        columns={columnsTableRoleComponents}
                        rows={rowsTableRoleComponents}
                        classGridComponent="gridAccountsCreateServices"
                        buttonGroupPage={buttonGroupForm}
                        selectionModel={selectionModel}
                        setSelectionModel={setSelectionModel}
                    />
                )
            },{
                label:getText("Permisos",userLanguage),
                body:(
                    <FullComponent
                        Titulo={tableRoleComponentTitle}
                        Body={TableComponent}
                        columns={columnsPermissionComponent}
                        rows={rowsPermissionComponent}
                        checkboxSelectionOption={false}
                        classGridComponent="gridAccountsCreateServices"
                        buttonGroupFooter={[]}
                        buttonGroupPage={buttonGroupUserPermission}
                        selectionModel={selectionModelPermission}
                        setSelectionModel={setSelectionModelPermission}
                    />
                )
            }
        ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowsTableRoleComponents,rowsPermissionComponent,dataInformationComponent,selectionModel])
    return (
        <>
            <FullComponent
                Titulo={titleRouts}
                Body={HorizontalTabComponent}
                data={dataHorizontalComponent}
                buttonGroupPage={buttonGroupFooter}
                buttonGroupFooter={[]}
            />
        </>
    );
}

export default UsersEdit;
