import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import CardComponent from "../../../../Components/CardComponent";
import FullComponent from "../../../../Components/FullComponent";
import InformationComponent from "../../../../Components/InformationComponent";
import TableComponent from "../../../../Components/TableComponent";
import VerticalTabComponent from "../../../../Components/VerticalTabComponent";
import HorizontalTabComponent from "../../../../Components/HorizontalTabComponent";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from "react";
import { getAccountsAction, updateAccountsRoleAction, createAccountsRoleAction, getAccountByIdAction } from "../../../../store/actions/accountsActions";
import { getUsersAction } from "../../../../store/actions/usuarioActions";
import { loadingAlerta, cerrarAlerta } from "../../../../config/alerts";
import { FaEdit, FaSync, FaDownload, FaUpload, FaPlusCircle, FaTrash } from 'react-icons/fa';
import getText from "../../../../config/languages";
import { useRouter } from 'next/router';
import Link from 'next/link';
const Roles = ({...pageProps}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        let pageName = "";
        const prefixName = "Roles";
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
                <Link key={`Accounts_Roles_Link_${index}`} href={rout.path} >
                    <a style={{margin: "-4px 0 0 5px"}} className={index !== newRouts.length - 1 ? 'currenHeaderLink' : 'headerLink'}>
                        {index > 0 ? ' / ':null}
                        {`${getText(rout.prefix,userLanguage)} ${rout.name?': '+rout.name:''}`}
                    </a>
                </Link>
            ))
            }
        </span>
        ))
    }, [])
    //empieza informationComponent
    const Titulo = "Roles"
    const { id } = pageProps.router.query
    const accounts = useSelector(state => state.accounts.accounts);
    const account = useSelector(state => state.accounts.account);
    const [ dataVerticalComponent, setDataVerticalComponent] = useState([])
    const [RolesPermissionsGroup, setRolesPermissionsGroup] = useState([])
    const [labelsRoles, setLabelsRoles] = useState([])
    const services = useSelector(state => state.accounts.services);
    useEffect(() => {
        //Consultar la api
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
    }, [id])
    useEffect(() => {
    }, [account])
    useEffect(() => {
        if (account) {
            const rolesPermissions = account.accountRoles;
            rolesPermissions.map(Role => {
                Role.RolesPermissions = account.accountRolesPermissions.filter(AccountRolPermission => AccountRolPermission.role_Id === Role.id)
                return Role;
            });
            setRolesPermissionsGroup(rolesPermissions)
        }
    }, [account])
    useEffect(() => {
        if (account ) {
            setLabelsRoles(account.accountRoles.map(role => 
                {
                    return {value:role.displayName,role_id:role.id}
                }
            ))
        }
    }, [RolesPermissionsGroup,account])
    useEffect(() => {
        if (account ) {
            setDataVerticalComponent(account.accountRoles.map(role => {
                return {
                    label: (<InputComponentLabel role={role} />),//(<TextField disabled id="" defaultValue="Hello World" />),
                    body:createBodyChildVerticalComponent(role.id),
                    focusOn : role.focusOn
                }
            }))
        }
    }, [labelsRoles])
    const InputComponentLabel = ({role}) =>{
        const [ inputValue, setInputValue] = useState(role.displayName)
        const onChangeValueInput = (e) => {
            e.preventDefault()
            setInputValue(e.target.value)
            const temp = labelsRoles.map(labelRole => {
                if(labelRole.role_id === role.id){
                    labelRole.value = e.target.value;
                }
                return labelRole;
            })
        }
        return <input value={inputValue} onChange={e => onChangeValueInput(e)} style={{cursor:"pointer",border:'0',paddingLeft:'10px'}} />
    }
    const ActionCellComponent = ({ params,ServicesPermissions,role_Id,RolesPermissions }) => {
        const elRefchecked = React.useRef();
        const [checkboxState, setCheckboxState] = useState(false)
        const [showCheckbox, setShowCheckbox] = useState(true);
        useEffect(() => {
            validateCheckboxState()
        }, [])
        const validateCheckboxState = () => {
            const serviceId = params.id;
            const permissionName = params.field;
            const RolPermissionsfound = RolesPermissions.find(Role => Role.id === role_Id);
            if (RolPermissionsfound && RolPermissionsfound.RolesPermissions) {
                const RolPermissions = RolPermissionsfound.RolesPermissions;
                const ServicePermissionfound = ServicesPermissions.find(service => service.id === serviceId)
                if (ServicePermissionfound && ServicePermissionfound.servicePermissions) {
                    const ServicePermission = ServicePermissionfound.servicePermissions
                    const permission = ServicePermission.find(permission => permission.name === permissionName);
                    if(permission){
                        const validateRolPermission = RolPermissions.find(rolpermission => rolpermission.permission_Id === permission.id);
                        if (validateRolPermission) {
                            setCheckboxState(true)
                        }
                    }else{
                        setShowCheckbox(false)
                    }
                }
            }
        }
        const handleSeeClick = (e) => {
            const stateCheckBox = elRefchecked.current.childNodes[0].childNodes[0].checked
            setCheckboxState(stateCheckBox)
            const index = params.row.id;
            const permissionName = params.field;
            RolesPermissionsGroup.map(rol => {
                if(rol.id === role_Id ){
                    const ServicePermissionfound = ServicesPermissions.find(service => service.id === index)
                    if (ServicePermissionfound) {
                        const permission = ServicePermissionfound.servicePermissions.find(permission => permission.name === permissionName);
                        if (stateCheckBox) {
                            rol.RolesPermissions.push({
                                permission_Id:permission.id,
                                Role_Id:rol.id})
                        }else{
                            rol.RolesPermissions = rol.RolesPermissions.filter(per => per.permission_Id !== permission.id, )
                            //aqui lo quitamos
                        }
                    }
                }
                return rol;
            })
            setRolesPermissionsGroup(RolesPermissionsGroup)
            //elRefchecked.current.childNodes[0].childNodes[0].checked = true;
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
    const CreateButtonGroups = (role_Id) => {
        const saveRole = (e) => {
            e.preventDefault(e);
            const found = RolesPermissionsGroup.find(role => role.id === role_Id);
            if (found) {
                const newDisplayName = labelsRoles.find(labelRole => labelRole.role_id === found.id)
                const RequesterEmail = sessionStorage.getItem('EMail')
                const updateRol = {
                    RoleId : found.id,
                    Name : newDisplayName ? newDisplayName.value : found.displayName,
                    DisplayName : newDisplayName ? newDisplayName.value : found.displayName,
                    Description : found.description,
                    RolPermises: found.RolesPermissions.map(per => (per.permission_Id))
                }
                //consumir reducer
                dispatch(updateAccountsRoleAction(updateRol,account))
            } else {
            }
        }
        const buttonGroupHeader = [
            {
                funcion : saveRole,
                nombre : getText("UPDATE",userLanguage),
                icono : <FaEdit style={{margin: "0 10px 0 0"}}/>,
                clase : "defaultButton"
            }
        ]
        return buttonGroupHeader;
    }
    const createBodyChildVerticalComponent = (role_Id) => {
        const buttonGroupHeaderTable = CreateButtonGroups(role_Id)
        const RolesPermissions = account.accountRoles;
        /**Agrupando los roles en sus permisos */
        RolesPermissions.map(Role => {
            Role.RolesPermissions = account.accountRolesPermissions.filter(AccountRolPermission => AccountRolPermission.role_Id === Role.id)
            return Role;
        });
        //setRolesPermissionsGroup(RolesPermissions)
        const ServicesPermissions = account.accountServices;
        ServicesPermissions.map(Service => {
            Service.servicePermissions = account.accountPermissions.filter(AccountPermission => AccountPermission.serviceId === Service.id)
            return Service;
        });
        /**headers */
        const headersServiceAccount = [];
        account.accountPermissions.forEach(AccountPermission => {
            const found = headersServiceAccount.find(hsa => hsa === AccountPermission.name)
            if (found) {
            } else {
                headersServiceAccount.push(AccountPermission.name)
            }
        });
        const columns = [
            {
                field: 'CREATE',
                headerName: getText('CREATE',userLanguage),
                sortable: false,
                width: 115,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    return (
                        <div style={{ cursor: "pointer",display: "contents" }} >
                            <ActionCellComponent params={params} ServicesPermissions={ServicesPermissions} role_Id={role_Id} RolesPermissions={RolesPermissions} />
                        </div>
                    );
                }
            },{
                field: 'READ',
                headerName: getText('READ',userLanguage),
                sortable: false,
                width: 115,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    return (
                        <div style={{ cursor: "pointer",display: "contents" }} >
                            <ActionCellComponent params={params} ServicesPermissions={ServicesPermissions} role_Id={role_Id} RolesPermissions={RolesPermissions} />
                        </div>
                    );
                }
            },{
                field: 'UPDATE',
                headerName: getText('UPDATE',userLanguage),
                sortable: false,
                width: 115,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    return (
                        <div style={{ cursor: "pointer",display: "contents" }} >
                            <ActionCellComponent params={params} ServicesPermissions={ServicesPermissions} role_Id={role_Id} RolesPermissions={RolesPermissions} />
                        </div>
                    );
                }
            },{
                field: 'DELETE',
                headerName: getText('DELETE',userLanguage),
                sortable: false,
                width: 115,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    return (
                        <div style={{ cursor: "pointer",display: "contents" }} >
                            <ActionCellComponent params={params} ServicesPermissions={ServicesPermissions} role_Id={role_Id} RolesPermissions={RolesPermissions} />
                        </div>
                    );
                }
            },{
                field: 'IMPORT',
                headerName: getText('IMPORT',userLanguage),
                sortable: false,
                width: 115,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    return (
                        <div style={{ cursor: "pointer",display: "contents" }} >
                            <ActionCellComponent params={params} ServicesPermissions={ServicesPermissions} role_Id={role_Id} RolesPermissions={RolesPermissions} />
                        </div>
                    );
                }
            },{
                field: 'EXPORT',
                headerName: getText('EXPORT',userLanguage),
                sortable: false,
                width: 115,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    return (
                        <div style={{ cursor: "pointer",display: "contents" }} >
                            <ActionCellComponent params={params} ServicesPermissions={ServicesPermissions} role_Id={role_Id} RolesPermissions={RolesPermissions} />
                        </div>
                    );
                }
            },{
                field: 'MANAGE',
                headerName: getText('MANAGE',userLanguage),
                sortable: false,
                width: 115,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    return (
                        <div style={{ cursor: "pointer",display: "contents" }} >
                            <ActionCellComponent params={params} ServicesPermissions={ServicesPermissions} role_Id={role_Id} RolesPermissions={RolesPermissions} />
                        </div>
                    );
                }
            }
        ]
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
        const rows = ServicesPermissions.map(service => {
            const rowTemp = service.servicePermissions.map(permissionService => ( {[permissionService.name] : permissionService.name}) )
            rowTemp.unshift({id:service.id},{svc:service.name})
            const rowTemporal = {};
            rowTemp.forEach(element => { rowTemporal[Object.keys(element)[0]] = element[Object.keys(element)[0]] });
            return rowTemporal;
        })
        /** */
        const SelectionTableChildComponent = () => { const [selectionModel,setSelectionModel] = useState([]) }
        const handleEditCellChangeCommitted = (cellData) => {}
        return (
            <FullComponent
                Title="hola"
                Body={TableComponent}
                columns={columns}
                rows={rows}
                handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                checkboxSelectionOption={false}
                classGridComponent="bodyAccountRolesComponent"
                //selectionModel={selectionModel}
                //setSelectionModel={setSelectionModel}
                buttonGroupPage={buttonGroupHeaderTable}
            />
        )
    }
    const closePage = (e) => {
        e.preventDefault();
        router.push(`/accounts`);
    }
    const addRole = (e) => {
        e.preventDefault(e);
        const RequesterEmail = sessionStorage.getItem('EMail')
        const equalNameRoles = account.accountRoles.filter(rol => rol.displayName.includes("New Rol"))
        const newRol = {
            //RequesterEmail : RequesterEmail,
            //AccountId : account.id,
            Name : `New Rol${equalNameRoles.length > 0 ? ` (${equalNameRoles.length})` : ''}`,
            //Id:"a1",
            DisplayName : `New Rol${equalNameRoles.length > 0 ? ` (${equalNameRoles.length})` : ''}`,
            Description : "Rol creado desde plataforma",
            RolPermises: [],
            //focusOn : true
        }
        dispatch(createAccountsRoleAction(account,newRol))
    }
    const buttonGroupFooter = [
        {
            funcion : closePage,
            nombre : getText("Regresar",userLanguage),
            icono : <FaEdit style={{margin: "0 10px 0 0"}}/>,
            clase : "neutroButton"
        },{
            funcion : addRole,
            nombre : getText("Agregar Rol",userLanguage),
            icono : <FaPlusCircle style={{margin: "0 10px 0 0"}}/>,
            clase : "successButton"
        }
    ]
    return (
        <>
            <FullComponent
                Titulo={titleRouts}
                Body={VerticalTabComponent}
                data={dataVerticalComponent}
                buttonGroupPage={buttonGroupFooter}
                classBody="TableRoles"
            />
        </>
    );
}

export default Roles;
