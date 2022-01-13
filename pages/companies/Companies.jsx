import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import FullComponent from "../../Components/FullComponent";
import TableComponent from "../../Components/TableComponent";
import MouseOverPopover from "../../Components/MouseOverPopover";

import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { FaPlusCircle, FaTrash, FaDatabase, FaSave, FaEye } from 'react-icons/fa';
import { getDevicesAction, updateDevicesAction, deleteDevicesAction } from "../../store/actions/devicesActions";
import { getUnitsAction } from "../../store/actions/unidadesActions";
import { getGpsModelsAction } from "../../store/actions/usuarioActions";
import { abrirAlertaCampos } from "../../config/alerts";
//
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//
import getText from "../../config/languages";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { companies } from "../../config/company";
const Companies = () => {
    const dispatch = useDispatch();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const [rows, setRows ] = useState(companies)
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        const pageName = "";
        const prefixName = "Compañias";
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
                <Link key={`Travels_Link_${index}`} href={rout.path} >
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
    const router = useRouter();
    const [selectionModel,setSelectionModel] = useState();
    /**
     * *ActionsComponent
     * *Componente ayuda para las acciones de filas en data grid
     * @index fila de datagrid
     */
    const ActionsComponent = ({ index }) => {
        return (
            <>
                <div className="tooltip" style={{right: "10px"}} >
                    <MouseOverPopover text='' hoverText={getText('VER COMPAÑIA',userLanguage)} icon={(<FaEye size={20} color="" style={{padding:"5px"}} onClick={()=>{}}  />)} />
                </div>
            </>
        );
    };
    const columns = [
        {
            field: 'id',
            headerName: 'id',
            editable:false,
            width: 100,
            flex:1,
            hide: true
        },{
            field: 'name',
            headerName: getText('Nombre',userLanguage),
            editable:false,
            flex:1,
            minWidth: 160,
            hide: false
        },{
            field: 'url',
            headerName: getText('URL',userLanguage),
            editable:false,
            minWidth: 160,
            flex:1,
            hide: false
        },{
            field: 'company_name',
            headerName: getText('Nombre de la compañia',userLanguage),
            editable:false,
            minWidth: 160,
            flex:1,
            hide: false
        },{
            field: "actions",
            headerName: getText("Acciones",userLanguage),
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <>
                        <div style={{ cursor: "pointer", display: "contents" }} >
                            <ActionsComponent index={params.row} />
                        </div>
                    </>
                );
            }
        }
    ]
    const buttonGroupPage = [{
        funcion : ()=>{router.push("/companies/create");},
        nombre : getText("Registrar compañia",userLanguage),
        icono : <FaPlusCircle style={{margin: "0 10px 0 0"}}/>,
        clase : "successButton"
    }]
    return(
        <div style={{ height: 400, width: '100%' }}>
            <FullComponent
                Titulo={titleRouts}
                Body={TableComponent}
                columns={columns}
                rows={rows}
                buttonGroupPage={buttonGroupPage}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                exportPermission={true}
                classGridComponent="tableResponsiveRules"
            />
        </div>
    );
}
export default Companies;