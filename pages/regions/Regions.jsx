import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import MouseOverPopover from "../../Components/MouseOverPopover";
import FullComponent from "../../Components/FullComponent"
import TableComponent from "../../Components/TableComponent";
import CardAccountsSelect from "../../Components/CardAccountsSelect";
import { FaEye, FaPlusCircle, FaSave } from 'react-icons/fa';
import { abrirAlertaCampos } from "../../config/alerts";
import { getRegionsAction,createRegionsAction,updateRegionsAction} from "../../store/actions/zonesActions";
import { getAccountsAction } from "../../store/actions/accountsActions";
import getText from "../../config/languages";
import { useRouter } from 'next/router';
import Link from 'next/link';
const Regions = () => {
    const dispatch = useDispatch()
    const router = useRouter();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        const pageName = "";
        const prefixName = "Regiones";
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
                    <Link key={`Regions_Link_${index}`} href={rout.path} >
                        <a className={index !== newRouts.length - 1 ? 'currenHeaderLink' : 'headerLink'} style={{margin: "-4px 0 0 5px"}}>
                            {index > 0 ? ' / ':null}
                            {`${getText(rout.prefix,userLanguage)} ${rout.name?':'+rout.name:''}`}
                        </a>
                    </Link>
                ))
            }
        </span>
        ))
    }, [])
    const Titulo = 'Regiones';
    const userUserType = useSelector(state => state.usuario.userType);
    const user = useSelector(state => state.usuario.user);
    const regions = useSelector(state => state.zones.regions);
    const [selectionModel,setSelectionModel] = useState();
    const [zoneSelectRoot,setZoneSelectRoot] = useState(true);
    const [ globalAccountId, setGlobalAccountId ] = useState(undefined)
    const [ globalExternalAccountId, setGlobalExternalAccountId ] = useState(undefined)
    const accounts = useSelector(state => state.accounts.accounts);
    /**
     * *useEffect inicial verificar si es tipo root y cargar todas las cuentas o cargar la cuenta de un usuario normal
     */
    useEffect(() => {
        if(userUserType === 1){
            if(!accounts){
                const loadAccounts = () => dispatch( getAccountsAction() );
                loadAccounts()
            }
        }else{
            setGlobalAccountId(user.accountId)
            setGlobalExternalAccountId(user.externalAccountId)
        }
    }, [accounts, dispatch, user, user, userUserType])
    useEffect(() => {
        if(globalAccountId){
            const loadRegions = () => dispatch( getRegionsAction(globalAccountId) );
            loadRegions()
        }
    }, [dispatch, globalAccountId])
    useEffect(() => {
        if(regions){
            setRows(regions.map(region => {
                return{
                    id:region.id,
                    name:region.name
                }
            }))
        }
    }, [regions])
    const ActionsComponent = ({ index }) => {
        const handleSeeRegion = () => {
            router.push(`/regions/${index['id']}/${globalAccountId}/${globalExternalAccountId}`);
        }
        const saveRegion = (e) => {
            e.preventDefault();
            if(index['id'] === "000-000"){
                //crear region
                if(index['name'].length < 5){
                    abrirAlertaCampos('warning',`El nombre de la región debe tener al menos 5 caracteres`)
                }
                const newRegion ={
                    "accountId": globalAccountId,
                    "name": index['name']
                }
                dispatch(createRegionsAction(newRegion))
            }else{
                //editar region
                const curretnRegion = regions.find(rule => rule.id === index['id'])
                if(index['name'].length < 5){
                    abrirAlertaCampos('warning',`El nombre de la región debe tener al menos 5 caracteres`)
                }else if(index['name'] === curretnRegion.name){
                    abrirAlertaCampos('warning',`No se detectaron cambios`)
                }else{
                    const newRegion ={
                        "RegionId": curretnRegion.id,
                        "name": index['name']
                    }
                    dispatch(updateRegionsAction(newRegion))
                }
            }
        }
        return (
            <>
                <div className="tooltip" style={{right: "40px"}} >
                    <MouseOverPopover text='' hoverText='ACTUALIZAR INFORMACIÓN' icon={(<FaSave size={30} color="" style={{padding:"5px"}} onClick={saveRegion}  />)} />
                </div>
                <div className="tooltip" style={{right: "10px"}} >
                    <MouseOverPopover text='' hoverText='VER REGIÓN' icon={(<FaEye size={30} color="" style={{padding:"5px"}} onClick={handleSeeRegion}  />)} />
                </div>
            </>
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
            headerName: 'Nombre',
            editable: true,
            minWidth: 160,
        },{
            field: "actions",
            headerName: "Acciones",
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer", display: "contents" }} >
                        <ActionsComponent index={params.row} />
                    </div>
                );
            },
            width: 95
        }
    ];
    const [rows, setRows ] = useState([])
    const addRegion = (e) => {
        const foundRow = rows.find(row => row.id === "000-000");
        if(foundRow){
            abrirAlertaCampos('warning','Ya se encuentra creando una región')
        }else{
            setRows([...rows,{
                id : "000-000",
                name:""
            }])
        }
    }
    const buttonGroupPage = [{
        funcion : addRegion,
        nombre : "Crear región",
        icono : <FaPlusCircle style={{margin: "0 10px 0 0"}}/>,
        clase : "successButton"
    }]
    if(userUserType === 1){
        buttonGroupPage.push({
            funcion : () => {
                setZoneSelectRoot(true);
                setRows([]);
                setGlobalAccountId(undefined);
                setGlobalExternalAccountId(undefined);
            },
            nombre : "Seleccionar cuenta",
            icono : null,
            clase : "neutroButton"
        })
    }
    /**
     * *onSubmitUpdateZoneRoot
     * *Seleccionar y cargar reglas de zona seleccionada
     * @values valores form
     */
    const onSubmitUpdateZoneRoot = async (values) =>{
        const accountFound = accounts.find(account=> account.id === values.account)
        console.log("accountFound")
        console.log(accountFound)
        if(accountFound){
            setZoneSelectRoot(false);
            setGlobalAccountId(accountFound.id);
            setGlobalExternalAccountId(accountFound.externalId);
        }
    }
    /**
     * *validateZoneRoot
     * *Validador
     * @values valores form
     */
    const validateZoneRoot = (values) => {
        const errors = {};
        //setCreateParentZonesSelect(false)
        if (!values.account) {
            errors.account = 'Requerido';
        }
        return errors;
    }
    const renderCard = () => {
        return(
            <CardAccountsSelect onSubmitUpdateZoneRoot={onSubmitUpdateZoneRoot} validateZoneRoot={validateZoneRoot} accounts={accounts} label='Ver regiones' />
        )
    }
    const renderComponent = () =>{
        return (
            <FullComponent
                Titulo={titleRouts}
                Body={TableComponent}
                columns={columns}
                rows={rows}
                handleEditCellChangeCommitted={()=>{}}
                buttonGroupPage={buttonGroupPage}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                exportPermission={false}
                classGridComponent="tableResponsiveRegions"
            />
        )
    }
    return userUserType === 1 && zoneSelectRoot ? renderCard():renderComponent();
}


export default Regions;