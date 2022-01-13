import FullComponent from "../../Components/FullComponent.jsx";
import TableComponent from "../../Components/TableComponent.jsx";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { getAccountsAction, upodateAccountsAction, deleteAccountsAction, activeAccountsAction } from "../../store/actions/accountsActions";
import { FaEye, FaTruck, FaPlusCircle, FaEdit, FaDownload, FaTrash, FaUserTag } from 'react-icons/fa';
import { loadingAlerta, cerrarAlerta } from "../../config/alerts";
import Chip from '@mui/material/Chip';
import getText from "../../config/languages";
import Link from 'next/link';
const Accounts = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const user = useSelector(state => state.usuario.user);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        if(user && user.type === 1){
            const pathname = window.location.pathname;
            const pageName = "";
            const prefixName = "Cuentas";
            const flagPrincipal=true;
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
                    <Link key={index} href={rout.path}>
                        <a>
                            <span style={{margin: "-4px 0 0 5px"}} className={index !== newRouts.length - 1 ? 'currenHeaderLink' : 'headerLink'} >
                                {index > 0 ? ' / ':null}
                                {`${getText(rout.prefix,userLanguage)} ${rout.name?':'+rout.name:''}`}
                            </span>
                        </a>
                    </Link>
                ))
                }
            </span>
            ))
        }
    }, [])
    const Titulo = getText("Cuentas",userLanguage);
    const [selectionModel,setSelectionModel] = useState();
    useEffect(() => {
        //Consultar la api
        if (user && user.type !== 1) {
            router.push(`/accounts/${user.accountId}`);
        }else{
            if(user && !Accounts){
                console.log(user)
                const loadAccounts = () => dispatch( getAccountsAction() );
                loadAccounts()
            }
        }
    }, [user])
    const Accounts = useSelector(state => state.accounts.accounts);
    useEffect(() => {
        if(Accounts && Accounts.length > 0){
            setRows(setInitialRows())
        }
    }, [Accounts])

    const handleEditCellChangeCommitted = (cellData) => {
        const unidadGet = Accounts.find(account => account.id === cellData.id)
        unidadGet[cellData.field] = cellData.props.value;
        dispatch(upodateAccountsAction(unidadGet))
        //enviar a reducer
    }
    //columns y rows
    const ActionCellComponent = ({ index }) => {
        const handleSeeClick = () => {
            router.push(`/accounts/${index.id}`);
        }
        const handleRoleClick = () => {
            router.push(`/accounts/roles/${index.id}`);
        }
        const handleEditClick = () => {
            router.push(`/accounts/edit/${index.id}`);
        };
        const handleExportClick = () => {
        };
        return (
            <>
                <div className="tooltip" style={{right: "170px"}} >
                    <FaEye size={20} color="" style={{padding:"5px"}} onClick={handleSeeClick} />
                    <span className="tooltiptext" >{getText("VER",userLanguage)}</span>
                </div>
                <div className="tooltip" style={{right: "130px"}} >
                    <FaEdit size={20} color="" style={{padding:"5px"}} onClick={handleEditClick} />
                    <span className="tooltiptext" >{getText("EDITAR",userLanguage)}</span>
                </div>
                <div className="tooltip" style={{right: "90px"}} >
                    <FaUserTag size={20} color="" style={{padding:"5px"}} onClick={handleRoleClick} />
                    <span className="tooltiptext" >{getText("ROLES",userLanguage)}</span>
                </div>
                <div className="tooltip" style={{right: "50px"}} >
                    <FaTruck size={20} color="" style={{padding:"5px"}} onClick={handleExportClick} />
                    <span className="tooltiptext" >{getText("EXPORTAR",userLanguage)}</span>
                </div>
                <div className="tooltip" style={{right: "10px"}} >
                    <FaDownload size={20} color="#1976d2" style={{ padding:"5px" }} onClick={handleExportClick} />
                    <span className="tooltiptext" >{getText("ACTUALIZAR UNIDADES",userLanguage)}</span>
                </div>
            </>
        );
    };

    const ChipComponent = ({params}) => {
        return(
            <>
                {
                    params.value ?
                    <Chip label={getText("Activo",userLanguage)} color="success" variant="outlined" className="muiChip-success" />
                    :
                    <Chip label={getText("Inactivo",userLanguage)} color="error" variant="outlined" className="muiChip-error" />
                }
            </>
        )
    }
    const columns = [
        {
            field: 'id',
            headerName: 'id',
            minWidth: 100,
            hide: true
        },{
            field: 'name',
            headerName: getText("Cuenta",userLanguage),
            flex: 1,
            minWidth: 200,
            editable: false,
        },{
            field: 'creatorEMail',
            headerName: getText("Creador",userLanguage),
            flex: 1,
            minWidth: 200,
            editable: false,
        },{
            field: 'description',
            headerName: getText("Descripción",userLanguage),
            flex: 1,
            minWidth: 200,
            editable: false,
        },{
            field: 'type',
            headerName: getText("Tipo",userLanguage),
            flex: 1,
            minWidth: 100,
            editable: false,
        },{
            field: 'active',
            headerName: getText("Activo",userLanguage),
            flex: 1,
            minWidth: 100,
            editable: false,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <ChipComponent params={params} />
                    </div>
                );
            }
        },{
            field: 'externalId',
            headerName: getText("Id Externo",userLanguage),
            flex: 1,
            minWidth: 200,
            editable: false,
        },{
            field: 'odooId',
            headerName: getText("Id Odoo",userLanguage),
            flex: 1,
            minWidth: 200,
            editable: false,
        },{
            field: "actions",
            headerName: getText("Acciones",userLanguage),
            sortable: false,
            minWidth: 210,
            disableClickEventBubbling: false,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer",display: "contents" }} >
                        <ActionCellComponent index={params.row} />
                    </div>
                );
            }
        }
    ];
    const setInitialRows = () => {
        const AccountObejctGrid = Accounts.map(accountOG => {
            return {
                id : accountOG.id,
                name : accountOG.name,
                creatorEMail : accountOG.creatorEMail,
                description : accountOG.description,
                type: accountOG.type,
                active: accountOG.active,
                externalId : accountOG.externalId,
                odooId : accountOG.odooId
            }
        })
        return AccountObejctGrid;
    }
    const [rows, setRows ] = useState()
    const registerAccountsFunction = (e) => {
        e.preventDefault();
        router.push(`/accounts/create`);
    }
    const deleteAccountsFunction = (e) => {
        e.preventDefault();
        dispatch(deleteAccountsAction(selectionModel,0))
    }
    const activeAccountsFunction = (e) => {
        e.preventDefault();
        let accountsToActive = Accounts.filter(currentAccount => selectionModel.find(accountT => currentAccount.id === accountT) )
        accountsToActive = accountsToActive.map(currentAccount => {
            const accountTA = {
                id: currentAccount.id,
                name: currentAccount.name,
                description: currentAccount.description,
                externalId: currentAccount.externalId,
                odooId: currentAccount.odooId,
                type: currentAccount.type,
                status: currentAccount.status,
                Active: true
            }
            return accountTA
        })
        dispatch(activeAccountsAction(accountsToActive,0))
    }
    const buttonGroupPage = [
        {
            funcion : registerAccountsFunction,
            nombre : getText("Registrar cuenta",userLanguage),
            icono : <FaPlusCircle style={{margin: "0 10px 0 0"}}/>,
            clase : "successButton"
        },{
            funcion : deleteAccountsFunction,
            nombre : getText("Eliminar",userLanguage),
            icono : <FaTrash style={{margin: "0 10px 0 0"}}/>,
            clase : "errorButton"
        },{
            funcion : activeAccountsFunction,
            nombre : getText("Activar",userLanguage),
            icono : null,
            clase : "defaultButton"
        }
    ]
    return (
        Accounts ?
            <FullComponent
                Titulo={titleRouts}
                Body={TableComponent}
                columns={columns}
                rows={rows}
                checkboxSelectionOption={true}
                buttonGroupPage={buttonGroupPage}
                buttonGroupFooter={[]}
                handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
            />
        :
        null
    );
}

export default Accounts;
