import FullComponent from "../../../Components/FullComponent.jsx";
import TableComponent from "../../../Components/TableComponent.jsx";
import VerticalTabComponent from "../../../Components/VerticalTabComponent.jsx";
import HorizontalTabComponent from "../../../Components/HorizontalTabComponent.jsx";
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from "react";
import { getAccountByIdAction } from "../../../store/actions/accountsActions";
import { getUsersAction, deleteUsersAction, activeUsersAction } from "../../../store/actions/usuarioActions";
import { loadingAlerta, cerrarAlerta, abrirAlertaCampos } from "../../../config/alerts";
import { FaEdit, FaDownload, FaPlusCircle, FaTrash, FaUserTag } from 'react-icons/fa';
import Chip from '@mui/material/Chip';
import getText from "../../../config/languages";
import { useRouter } from 'next/router'
import Link from 'next/link'
const ChipComponent = ({params}) => {
    return(
        <>
            {
                params.value ?
                <Chip label="Activo" color="success" variant="outlined" className="muiChip-success" />
                :
                <Chip label="Inactivo" color="error" variant="outlined" className="muiChip-error"/>
            }
        </>
    )
}
const AccountsGet = ({...pageProps}) => {
    const dispatch = useDispatch();
    console.log(pageProps)
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const router = useRouter()
    const account = useSelector(state => state.accounts.account)
    const { id } = pageProps.router.query
    console.log(id)
    const userUserType = useSelector(state => state.usuario.userType);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        let pageName = "";
        console.log(account)
        if(account && account.id === id){
            pageName = account.name;
            const prefixName = "Cuenta";
            let flagPrincipal=false;
            if(userUserType !== 1){
                flagPrincipal=true;
            }
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
            console.log(newRouts)
            sessionStorage.setItem('rout', JSON.stringify(newRouts));
            //setCurrentRouts(routs)
            setTitleRouts(()=>(
            <span>
                {
                newRouts.map((rout,index)=>(
                    <Link key={`AccountsGet_Link_${index}`} href={rout.path} >
                        <a style={{margin: "-4px 0 0 5px"}} className={index !== newRouts.length - 1 ? 'currenHeaderLink' : 'headerLink'}>
                            {index > 0 ? ' / ':null}
                            {`${getText(rout.prefix,userLanguage)} ${rout.name?': '+rout.name:''}`}
                        </a>
                    </Link>
                ))
                }
            </span>
            ))
        }
    }, [account])
    const userPermissions = useSelector(state => state.usuario.permissions);
    const createUserPermission = userPermissions.find( per => per.displayName.search("CREATE_USERS") >=0)
    const deleteUserPermission = userPermissions.find( per => per.displayName.search("DELETE_USERS") >=0)
    const updateUserPermission = userPermissions.find( per => per.displayName.search("UPDATE_USERS") >=0)
    const exportUserPermission = userPermissions.find( per => per.displayName.search("EXPORT_USERS") >=0)
    //empieza informationComponent
    const [Titulo, setTitulo] = useState("")
    const accounts = useSelector(state => state.accounts.accounts);
    useEffect(() => {
        //Consultar la api
        console.log("aqui")
        if (userUserType === 1 || userUserType === 2) {
            if(!account){
                if(id){
                    const cargarCuentas = () => dispatch( getAccountByIdAction(id) );
                    cargarCuentas();
                }
            }else{
                if(id){
                    if(account.id !== id){
                        const cargarCuentas = () => dispatch( getAccountByIdAction(id) );
                        cargarCuentas();
                    }
                }
            }
        }
    }, [dispatch, id, userUserType])
    useEffect(() => {
    }, [accounts])
    const createDataVerticalComponent = React.useCallback(
        function(){
            if (account !== null && account !== undefined) {
                let tempObject = Object.keys(account).map((prop) => {
                    if (prop === "accountPermissions") {
                        //crear body
                        const propsBody = createBodyChildComponents(account[prop])
                        const tempBody = <TableComponent Titulo={getText('Permisos',userLanguage)} Body={TableComponent} columns={propsBody.columns} rows={propsBody.rows} classGridComponent="gridAccountsCreateVerticalComponent tableResponsiveIA" checkboxSelectionOption={false} />
                        return {id:account["id"],label:getText('Permisos',userLanguage),body:tempBody}
                    }else if(prop === "accountServices"){
                        //crear body
                        const propsBody = createBodyChildComponents(account[prop])
                        const tempBody = <TableComponent Titulo={getText('Servicios',userLanguage)} Body={TableComponent} columns={propsBody.columns} rows={propsBody.rows} classGridComponent="gridAccountsCreateVerticalComponent tableResponsiveIA" checkboxSelectionOption={false} />
                        return {id:account["id"],label:getText('Servicios',userLanguage),body:tempBody}
                    }else if(prop === "accountRoles"){
                        //aqui obtendremos los permisos del rol mas tarde
                        //crear body
                        const propsBody = createBodyChildComponents(account[prop])
                        const tempBody = <TableComponent Titulo={getText('Roles',userLanguage)} Body={TableComponent} columns={propsBody.columns} rows={propsBody.rows} classGridComponent="gridAccountsCreateVerticalComponent tableResponsiveIA" checkboxSelectionOption={false} />
                        return {id:account["id"],label:getText('Roles',userLanguage),body:tempBody}
                    }else{
                        return null
                    }
                })
                setDataVerticalComponent(tempObject.filter(file => file !== null))
            }
        },
        [account]
    )
    useEffect(() => {
        createDataVerticalComponent()
        if (account && account !== null) {
            setTitulo(`${getText('Cuenta',userLanguage)} : ${account.name}`)
        }
    }, [account, createDataVerticalComponent])
    const roleAccount = () => {
        router.push(`/accounts/roles/${id}`);
    }
    const closePage = (e) => {
        e.preventDefault();
        router.push(`/accounts`);
    }
    const buttonGroupHeader = [
        {
            funcion : closePage,
            nombre : getText('Regresar',userLanguage),
            icono : null,
            clase : "neutroButton"
        },{
            funcion : () => {},
            nombre : getText('Actualizar Unidades',userLanguage),
            icono : <FaDownload style={{margin: "0 10px 0 0"}}/>,
            clase : "defaultButton"
        }
    ]
    if (userUserType === 1 || userUserType === 2) {
        buttonGroupHeader.push({
            funcion : roleAccount,
            nombre : getText('Roles',userLanguage),
            icono : <FaUserTag style={{margin: "0 10px 0 0"}}/>,
            clase : "defaultButton"
        })
    }
    ///empieza verticalComponent
    const TituloVerticalComponent = getText('Información avanzada',userLanguage)
    const [dataVerticalComponent, setDataVerticalComponent] = useState([])
    const createBodyChildComponents = (object) => {
        object = object ? object : [];
        const columnsBodyChildComponents = object[0].displayName ?
            [
                {
                    field: 'id',
                    headerName: 'id',
                    width: 100,
                    hide: true
                },{
                    field: 'displayName',
                    headerName: getText('Identificador',userLanguage),
                    minWidth: 250,
                    hide: false
                },{
                    field: 'name',
                    headerName: getText('Nombre',userLanguage),
                    minWidth: 250,
                    hide: false
                },{
                    field: 'description',
                    headerName: getText('Descripción',userLanguage),
                    flex: 1,
                    minWidth: 350,
                    hide: false
                },
            ]
        :
            [
                {
                    field: 'id',
                    headerName: 'id',
                    width: 100,
                    hide: true
                },{
                    field: 'name',
                    headerName: getText('Nombre',userLanguage),
                    flex: 1,
                    hide: false
                },{
                    field: 'description',
                    headerName: getText('Descripción',userLanguage),
                    flex: 1,
                    minWidth: 200,
                    hide: false
                },
            ];
        const rowsBodyChildComponents = object.map(obj => {
            return {
                id : obj.id,
                displayName : getText(obj.displayName,userLanguage),
                name : getText(obj.name,userLanguage),
                description : obj.description,
            }
        })
        return {columns:columnsBodyChildComponents,rows:rowsBodyChildComponents}
    }
    ///empieza TableComponent users
    const userTypes = useSelector(state => state.usuario.userTypes);
    useEffect(() => {
        //Consultar la api
        const cargarUsuarios = () => dispatch( getUsersAction(id) );
        cargarUsuarios()
    }, [dispatch, id])
    const Usuarios = useSelector(state => state.usuario.users);
    const [userFilter,setUsersFilter] = useState()
    useEffect(() => {
        if (Usuarios && account) {
            setUsersFilter(Usuarios.filter(usuario => usuario.accountId === account.id))
            //setRows(setInitialRows())
        }
    }, [Usuarios,account])
    const setInitialRows = React.useCallback(
        function(){
            const tempoU = userFilter.map(us => {
                const typeName = userTypes.find(type => type.id === us.userType);
                return {
                    id : us.id,
                    name : us.name,
                    email : us.email,
                    userType : typeName ? typeName.name : us.userType,
                    active : us.active
                }
            })
            return tempoU;
        },
        [userFilter, userTypes]
    )
    useEffect(() => {
        if (userFilter) {
            setRows(setInitialRows())
        }
    }, [setInitialRows, userFilter])
    const loadingUsuario = useSelector(state => state.usuario.loading);
    useEffect(() => {
        if (loadingUsuario) {
            loadingAlerta()
        }else{
            cerrarAlerta()
        }
    }, [loadingUsuario])
    const EditUser = ({ index }) => {
        const handleEditClick = () => {
            router.push(`/user/edit/${index.id}`);
        };
        return (
            <FaEdit size={20} style={{padding:"5px"}} onClick={handleEditClick} />
        );
    };
    const columns = [
        {
            field: 'id',
            headerName: 'id',
            width: 100,
            hide: true
        },{
            field: 'name',
            headerName: getText('Nombre',userLanguage),
            flex: 1,
            minWidth: 250,
        },{
            field: 'email',
            headerName: getText('Email',userLanguage),
            flex: 1,
            minWidth: 250,
        },{
            field: 'userType',
            headerName: getText('Tipo',userLanguage),
            flex: 1,
            minWidth: 200,
        },{
            field: 'active',
            headerName: getText('Estado',userLanguage),
            flex: 1,
            minWidth: 100,
            hide: false,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <ChipComponent params={params} />
                    </div>
                );
            }
        }
    ];
    if(updateUserPermission || userUserType === 1){
        columns.push({
            field: "actions",
            headerName: getText('Acciones',userLanguage),
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <EditUser index={params.row} />
                    </div>
                );
            }
        })
    }
    const [rows, setRows ] = useState()
    const TituloTableComponent = getText('Usuarios Registrados',userLanguage);
    const [selectionModel,setSelectionModel] = useState([]);
    const deleteFunction = (e) => {
        e.preventDefault()
        if (selectionModel.length <= 0) {
            abrirAlertaCampos('warning','Seleccione al menos un usuario')
        }else{
            dispatch(deleteUsersAction(selectionModel,0))
        }
    }
    const activeUserFunction = (e) => {
        e.preventDefault()
        let usersToActive = userFilter.filter(currentUser => selectionModel.find(userT => currentUser.id === userT) )
        usersToActive = usersToActive.map(currentUser => {
            const userTA = {
                id:currentUser.id,
                accountId: currentUser.accountId,
                Email:currentUser.email,
                Name : currentUser.name,
                Active: true,
                Roles:currentUser.roles,
                Type:currentUser.userType
            }
            return userTA
        })
        if (selectionModel.length <= 0) {
            abrirAlertaCampos('warning','Seleccione al menos un usuario')
        }else{
            dispatch(activeUsersAction(usersToActive,0))
        }
    }
    const createUser = (e) => {
        e.preventDefault();
        router.push(`/user/create/${id}`);
    }
    const buttonGroupPageTableComponent = [
    ]
    const [dataHorizontalComponent, setDataHorizontalComponent] = useState([])
    useEffect(() => {
        if (createUserPermission || userUserType === 1) {
            buttonGroupPageTableComponent.push({
                funcion : createUser,
                nombre : getText('Agregar usuario',userLanguage),
                icono : <FaPlusCircle style={{margin: "0 10px 0 0"}}/>,
                clase : "successButton"
            })
        }
        if (deleteUserPermission || userUserType === 1) {
            buttonGroupPageTableComponent.push({
                funcion : deleteFunction,
                nombre : getText('Eliminar usuario',userLanguage),
                icono : <FaTrash style={{margin: "0 10px 0 0"}}/>,
                clase : "errorButton"
            })
        }
        if(updateUserPermission || userUserType === 1){
            buttonGroupPageTableComponent.push({
                funcion : activeUserFunction,
                nombre : getText('Activar usuario',userLanguage),
                icono : null,
                clase : "defaultButton"
            })
        }
        const principalComponent = userUserType !== 3 ?
            [
                {
                    label:TituloVerticalComponent,
                    body:(
                        <FullComponent
                            Titulo=""
                            Body={VerticalTabComponent}
                            data={dataVerticalComponent}
                        />
                    )
                },{
                    label:TituloTableComponent,
                    body:(
                        <FullComponent
                            Titulo=""
                            Body={TableComponent}
                            columns={columns}
                            rows={rows}
                            buttonGroupPage={buttonGroupPageTableComponent}
                            selectionModel={selectionModel}
                            setSelectionModel={setSelectionModel}
                            exportUserPermission={exportUserPermission || userUserType === 1 ? true : false}
                            classComponent="bodyAccountUserComponent"
                            classGridComponent="gridAccountsCreateVerticalComponent tableResponsiveUR"
                        />
                    )
                }
            ]
        :
            [
                {
                    label:TituloTableComponent,
                    body:(
                        <FullComponent
                            Titulo=""
                            Body={TableComponent}
                            columns={columns}
                            rows={rows}
                            buttonGroupPage={buttonGroupPageTableComponent}
                            selectionModel={selectionModel}
                            setSelectionModel={setSelectionModel}
                            exportPermission={exportUserPermission || userUserType === 1 ? true : false}
                            classComponent="bodyAccountUserComponent"
                        />
                    )
                }
            ]
        setDataHorizontalComponent(principalComponent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataVerticalComponent,
        selectionModel,
        rows,
        createUserPermission,
        userUserType,
        deleteUserPermission, updateUserPermission, exportUserPermission])
    return (
        <>
            <FullComponent
                Titulo={titleRouts}
                Body={HorizontalTabComponent}
                data={dataHorizontalComponent}
                buttonGroupPage={buttonGroupHeader}
                classBody="TableAccountsGet"
            />
        </>
    );
}

export default AccountsGet;
