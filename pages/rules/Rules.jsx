import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import MouseOverPopover from "../../Components/MouseOverPopover";
import FullComponent from "../../Components/FullComponent";
import TableComponent from "../../Components/TableComponent";
import { FaPlusCircle, FaTrash, FaSave } from 'react-icons/fa';
//
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//
import CardAccountsSelect from "../../Components/CardAccountsSelect";
import { getRulesAction,createRulesAction,updateRulesAction,deleteRulesAction } from "../../store/actions/rulesActions";
import { getClassificationsAction } from "../../store/actions/zonesActions";
import { getAccountsAction } from "../../store/actions/accountsActions";
import { abrirAlertaCampos } from "../../config/alerts";
import getText from "../../config/languages";
import Link from 'next/link';
const HourComponent = ({ index,  field, handleEditCellChangeCommitted, valueOptions, editableColumns=true, createPermission }) => {
    //fecha en UTC
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const [valueMinutes,setValueMinutes] = useState(0)
    const [valueHours,setValueHours] = useState(0)
    const [valueDays,setValueDays] = useState(0)
    useEffect(() => {
        const initialValue = index[field];
        const days = parseInt(initialValue/1440);
        const remainderDays = initialValue%1440;
        const hours = parseInt(remainderDays/60);
        const remainderHours = remainderDays%60;
        setValueMinutes(remainderHours)
        setValueHours(hours)
        setValueDays(days)
    },[field, index])
    const minutosSelect = [
        {id:0,label:0},
        {id:5,label:5},
        {id:10,label:10},
        {id:15,label:15},
        {id:20,label:20},
        {id:25,label:25},
        {id:30,label:30},
        {id:35,label:35},
        {id:40,label:40},
        {id:45,label:45},
        {id:50,label:50},
        {id:55,label:55},
    ]
    const horasSelect = [
        {id:0,label:0},
        {id:1,label:1},
        {id:2,label:2},
        {id:3,label:3},
        {id:4,label:4},
        {id:5,label:5},
        {id:6,label:6},
        {id:7,label:7},
        {id:8,label:8},
        {id:9,label:9},
        {id:10,label:10},
        {id:11,label:11},
        {id:12,label:12},
        {id:13,label:13},
        {id:14,label:14},
        {id:15,label:15},
        {id:16,label:16},
        {id:17,label:17},
        {id:18,label:18},
        {id:19,label:19},
        {id:20,label:20},
        {id:21,label:21},
        {id:22,label:22},
        {id:23,label:23},
    ]
    const diasSelect = [
        {id:0,label:0},
        {id:1,label:1},
        {id:2,label:2},
        {id:3,label:3},
        {id:4,label:4},
        {id:5,label:5},
        {id:6,label:6},
        {id:7,label:7},
        {id:8,label:8},
        {id:9,label:9},
        {id:10,label:10},
        {id:11,label:11},
        {id:12,label:12},
        {id:13,label:13},
        {id:14,label:14},
        {id:15,label:15},
        {id:16,label:16},
        {id:17,label:17},
        {id:18,label:18},
        {id:19,label:19},
        {id:20,label:20},
        {id:21,label:21},
        {id:22,label:22},
        {id:23,label:23},
        {id:24,label:24},
        {id:25,label:25},
        {id:26,label:26},
        {id:27,label:27},
        {id:28,label:28},
        {id:29,label:29},
        {id:30,label:30},
    ]
    useEffect(() => {
            handleEditCellChangeCommitted(valueMinutes + (valueHours * 60) + (valueDays * 24 * 60))
            index[field]=valueMinutes + (valueHours * 60) + (valueDays * 24 * 60);
    }, [valueMinutes, valueHours, valueDays, handleEditCellChangeCommitted, index, field])
    return (
        <>
            <FormControl variant="standard" style={{width: "20px"}}>
                <Select
                    className='selectRules'
                    labelId="demo-controlled-open-select-label"
                    id={`demo-controlled-open-select_${index}`}
                    onChange={e => setValueDays(e.target.value)}
                    value={valueDays}
                    disabled={editableColumns ? false : (createPermission && index['id'] === "000-000" ?false:true)}
                >
                    {
                            diasSelect.map(opt => (<MenuItem key={`Rules_HourComponent_MenuItem_day_${index}`} value={opt.id}>{opt.label}</MenuItem>))
                    }
                </Select>
            </FormControl>
            <FormControl style={{margin: "0 5px 0 0"}}>{getText('dia(s)',userLanguage)}:</FormControl>
            <FormControl variant="standard" style={{width: "20px"}}>
                <Select
                    className='selectRules'
                    labelId="demo-controlled-open-select-label"
                    id={`demo-controlled-open-select_${index}`}
                    onChange={e => setValueHours(e.target.value)}
                    value={valueHours}
                    disabled={editableColumns ? false : (createPermission && index['id'] === "000-000" ?false:true)}
                >
                    {
                        horasSelect.map(opt => (<MenuItem key={`Rules_HourComponent_MenuItem_hours_${index}`} value={opt.id}>{opt.label}</MenuItem>))
                    }
                </Select>
            </FormControl>
            <FormControl style={{margin: "0 5px 0 0"}}>{getText('hora(s)',userLanguage)}:</FormControl>
            <FormControl variant="standard" style={{width: "20px"}}>
                <Select
                    className='selectRules'
                    labelId="demo-controlled-open-select-label"
                    id={`demo-controlled-open-select_${index}`}
                    onChange={e => setValueMinutes(e.target.value)}
                    value={valueMinutes}
                    disabled={editableColumns ? false : (createPermission && index['id'] === "000-000" ?false:true)}
                >
                    {
                        minutosSelect.map(opt => (<MenuItem key={`Rules_HourComponent_MenuItem_minutes_${index}`} value={opt.id}>{opt.label}</MenuItem>))
                    }
                </Select>
            </FormControl>
            <FormControl>{getText('minuto(s)',userLanguage)}</FormControl>
        </>
    );
}
const Rules = () => {
    const dispatch = useDispatch()
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        const pageName = "";
        const prefixName = "Reglas";
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
                <Link key={`Rules_Link_${index}`} href={rout.path} >
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
    const Titulo = "Reglas"
    const [selectionModel,setSelectionModel] = useState();
    const classifications = useSelector(state => state.zones.classifications);
    const [classificationToSelect,setClassificationToSelect] = useState([])
    const user = useSelector(state => state.usuario.user);
    const userPermissions = useSelector(state => state.usuario.permissions);
    const userUserType = useSelector(state => state.usuario.userType);
    const createZonePermission = (userPermissions.find( per => per.displayName.search("CREATE_ZONES") >=0) || userUserType === 1)? true : false;
    const deleteZonePermission = (userPermissions.find( per => per.displayName.search("DELETE_ZONES") >=0) || userUserType === 1)? true : false;
    const updateZonePermission = (userPermissions.find( per => per.displayName.search("UPDATE_ZONES") >=0) || userUserType === 1)? true : false;
    const exportZonePermission = (userPermissions.find( per => per.displayName.search("EXPORT_ZONES") >=0) || userUserType === 1)? true : false;
    const rules = useSelector(state => state.rules.rules);
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
    }, [accounts, user, userUserType])
    /**
     * *useEffect inicial para cargar clasificaciones y reglas
     */
    useEffect(() => {
        if(globalAccountId){
            if(!classifications){
                const loadClassifications = () => dispatch( getClassificationsAction(globalAccountId) );
                loadClassifications()
            }
            if(!rules){
                const loadRules = () => dispatch( getRulesAction(globalAccountId) );
                loadRules()
            }
        }
    }, [globalAccountId])
    /**
     * *useEffect para cargar valores de filas en datagrid
     * @classifications
     * @rules
     */
    useEffect(() => {
        if(classifications){
            const tempCla = classifications.filter(cla => !cla.parent || cla.parent === '00000000-0000-0000-0000-000000000000')
            setClassificationToSelect(tempCla.map(cla => {
                return { id:cla.id, label:cla.alias }
            }))
            if(rules){
                setRows(rules.map(rule => ({
                    id : rule.id,
                    zone : rule.geofenceId,
                    maxUnits : rule.maxUnits,
                    timeBeforePit : rule.timeBeforePit,
                    timeInPit : rule.timeInPit,
                    timeAfterPit : rule.timeAfterPit
                })))
            }else{
                setRows([])
            }
        }
    }, [classifications, rules])
    /**
     * *SelectComponent
     * *Componente select para datagrid
     * @index informacion de la fila
     * @field nombre de la celda
     * @handleEditCellChangeCommitted funcion que nos ayuda en el cambio de estado de la celda
     * @valueOptions valores del celect
     * @editableColumns variable que nos permite saber si la celda es editable o no
     */
    const SelectComponent = ({ index,  field, handleEditCellChangeCommitted, valueOptions, editableColumns=true }) => {
        const [valorSelect, setValorSelect] = useState(index[field]);
        const handleChange = (cellData) => {
            setValorSelect(cellData.value)
            handleEditCellChangeCommitted(cellData)
            index[field]=cellData.value;
        };
        const filterOptions = () => {
            const myZone = index[field];
            const newValuesOptions = valueOptions.filter(opt => !rules.find(rule => rule.geofenceId === opt.id ) || opt.id === myZone)
            return newValuesOptions;
        }
        return (
            <FormControl variant="standard" style={{width: "100%"}}>
                <Select
                    className={index['id'] === '000-000' ? null : 'selectRules'}
                    labelId="demo-controlled-open-select-label"
                    id={`demo-controlled-open-select_${index}`}
                    onChange={e => handleChange({id:index.id,field,value:e.target.value} )}
                    value={valorSelect}
                    disabled={index['id'] === '000-000' ? false : true}
                >
                    {
                        filterOptions().map(opt => (<MenuItem key={`Rules_SelectComponent_MenuItem_${index}`} value={opt.id}>{opt.label}</MenuItem>))
                    }
                </Select>
            </FormControl>
        );
    };
    /**
     * *ActionsComponent
     * *Componente ayuda para las acciones de filas en data grid
     * @index fila de datagrid
     */
    const ActionsComponent = ({ index }) => {
        const validateRule = (newRule) => {
            let falgValidate = true;
            let errors = "";
            if(newRule.maxUnits <= 0){
                errors += "<li>El numero de unidades debe ser mayor a 0</li>";
                falgValidate = false;
            }
            if(newRule.timeBeforePit <= 0){
                errors += "<li>El tiempo antes de fosa debe ser mayor a 0</li>";
                falgValidate = false;
            }
            if(newRule.timeInPit <= 0){
                errors += "<li>El tiempo en fosa debe ser mayor a 0</li>";
                falgValidate = false;
            }
            if(newRule.timeAfterPit <= 0){
                errors += "<li>El tiempo despues de fosa debe ser mayor a 0</li>";
                falgValidate = false;
            }
            if(!newRule.geofenceId){
                errors += "<li>Seleccione zona</li>";
                falgValidate = false;
            }
            if(!falgValidate){
                abrirAlertaCampos('error',`<ul style='list-style: unset;'>${errors}</ul> `)
            }
            return falgValidate;
        }
        const validateRuleUpdate = (newRule,curretnRule) => {
            let falgValidate = true;
            let errors = "";
            if(newRule.maxUnits <= 0){
                errors += "<li>El numero de unidades debe ser mayor a 0</li>";
                falgValidate = false;
            }
            if(newRule.timeBeforePit <= 0){
                errors += "<li>El tiempo antes de fosa debe ser mayor a 0</li>";
                falgValidate = false;
            }
            if(newRule.timeInPit <= 0){
                errors += "<li>El tiempo en fosa debe ser mayor a 0</li>";
                falgValidate = false;
            }
            if(newRule.timeAfterPit <= 0){
                errors += "<li>El tiempo despues de fosa debe ser mayor a 0</li>";
                falgValidate = false;
            }
            if(!falgValidate){
                abrirAlertaCampos('error',`<ul style='list-style: unset;'>${errors}</ul> `)
            }else{
                if(
                    newRule.maxUnits === curretnRule.maxUnits &&
                    newRule.timeBeforePit === curretnRule.timeBeforePit &&
                    newRule.timeInPit === curretnRule.timeInPit &&
                    newRule.timeAfterPit === curretnRule.timeAfterPit
                ){
                    abrirAlertaCampos('warning',`No se detectaron cambios`)
                    falgValidate=false;
                }
            }
            return falgValidate;
        }
        const saveRule = (e) => {
            e.preventDefault();
            if(index['id'] === "000-000"){
                const newRule ={
                    geofenceId:index['zone'],
                    gurtamGeofenceId:'ND',
                    accountId:globalAccountId,
                    accountGurtamId:globalExternalAccountId,
                    maxUnits:parseInt(index['maxUnits']),
                    timeBeforePit:index['timeBeforePit'],
                    timeInPit:index['timeInPit'],
                    timeAfterPit:index['timeAfterPit'],
                }
                if(validateRule(newRule)){
                    dispatch(createRulesAction(newRule))
                }
            }else{
                const curretnRule = rules.find(rule => rule.id === index['id'])
                const newRule={
                    maxUnits:parseInt(index['maxUnits']),
                    timeBeforePit:index['timeBeforePit'],
                    timeInPit:index['timeInPit'],
                    timeAfterPit:index['timeAfterPit'],
                }
                if(validateRuleUpdate(newRule,curretnRule)){
                    dispatch(updateRulesAction(newRule,curretnRule))
                }
            }
        }
        return (
            <>
                {
                    editableColumns || (createZonePermission && index['id'] === "000-000" ) ?
                        <div className="tooltip" style={{right: "10px"}} >
                            <MouseOverPopover text='' hoverText={getText('ACTUALIZAR INFORMACIÓN',userLanguage)} icon={(<FaSave size={20} color="" style={{padding:"5px"}} onClick={saveRule}  />)} />
                        </div>
                    :
                        null
                }
            </>
        );
    };
    let editableColumns=false;
    if(updateZonePermission || userUserType === 1){
        editableColumns=true;
    }
    const columns = [
        {
            field: 'id',
            headerName: 'id',
            editable:false,
            width: 100,
            hide: true
        },{
            field: 'zone',
            headerName: getText('Zona',userLanguage),
            sortable: false,
            flex:1,
            minWidth: 100,
            editable: false,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <SelectComponent
                            index={params.row}
                            field='zone'
                            handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                            valueOptions={classificationToSelect}
                            editableColumns={editableColumns}
                        />
                    </div>
                );
            },
        },{
            field: 'maxUnits',
            headerName: (<span style={{marginRight: "20px"}}>{getText("Max. Vehículos",userLanguage)}</span>),
            editable: true,
            type: 'number',
            minWidth: 160,
        },{
            field: 'timeBeforePit',
            headerName: (<MouseOverPopover text={getText('Antes de fosa',userLanguage)} hoverText={getText('Formato: días/horas/minutos:',userLanguage)}/>),
            editable: false,
            sortable: false,
            flex:1,
            minWidth: 100,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <div style={{ cursor: "pointer" }} >
                            <HourComponent
                                index={params.row}
                                field='timeBeforePit'
                                handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                                valueOptions={classificationToSelect}
                                editableColumns={editableColumns }
                                createPermission={createZonePermission}
                            />
                        </div>
                    </div>
                );
            }
        },{
            field: 'timeInPit',
            headerName: (<MouseOverPopover text={getText('En fosa',userLanguage)} hoverText={getText('Formato: días/horas/minutos:',userLanguage)} />),
            editable: false,
            sortable: false,
            flex:1,
            minWidth: 100,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <div style={{ cursor: "pointer" }} >
                            <HourComponent
                                index={params.row}
                                field='timeInPit'
                                handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                                valueOptions={classificationToSelect}
                                editableColumns={editableColumns}
                                createPermission={createZonePermission}
                            />
                        </div>
                    </div>
                );
            }
        },{
            field: 'timeAfterPit',
            headerName: (<MouseOverPopover text={getText('Despues de fosa',userLanguage)} hoverText={getText('Formato: días/horas/minutos:',userLanguage)} />),
            editable: false,
            sortable: false,
            flex:1,
            minWidth: 100,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <div style={{ cursor: "pointer" }} >
                            <HourComponent
                                index={params.row}
                                field='timeAfterPit'
                                handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                                valueOptions={classificationToSelect}
                                editableColumns={editableColumns}
                                createPermission={createZonePermission}
                            />
                        </div>
                    </div>
                );
            }
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
            },
            width: 95
        }
    ];
    const [rows, setRows ] = useState([])
    const handleEditCellChangeCommitted = (cellData) => {
    }
    /**
     * *addRule
     * *Agrega una fila a datagrid para crear nueva regla
     * @e evento
     */
    const addRule = (e) => {
        e.preventDefault();
        const foundRow = rows.find(row => row.id === "000-000");
        if(foundRow){
            abrirAlertaCampos('warning','Ya se encuentra creando una regla')
        }else{
            setRows([...rows,{
                id : "000-000",
                zone : '',
                maxUnits : 5,
                timeBeforePit : 5,
                timeInPit : 5,
                timeAfterPit : 5
            }])
        }
    }
    /**
     * *addRule
     * *Eliminar las reglas seleccionadas
     * @e evento
     */
    const deleteRule = (e) => {
        e.preventDefault();
        if (!selectionModel || selectionModel.length <= 0) {
            abrirAlertaCampos('warning','Seleccione al menos una regla')
        }else{
            let sendToDelete = selectionModel;
            const ruleTempo = sendToDelete.find(sel => sel === '000-000')
            if(ruleTempo){
                sendToDelete = sendToDelete.filter(sel => sel !== '000-000')
                setRows(rows.filter(row => row.id !== '000-000'))
            }
            if(sendToDelete.length > 0){
                dispatch(deleteRulesAction(sendToDelete,0))
            }
        }
    }
    const buttonGroupPage = []
    if(userUserType === 1){
        buttonGroupPage.push({
            funcion : () => {
                setZoneSelectRoot(true);
                setRows([]);
                setGlobalAccountId(undefined);
                setGlobalExternalAccountId(undefined);
            },
            nombre : getText("Seleccionar cuenta",userLanguage),
            icono : null,
            clase : "neutroButton"
        })
    }
    if(createZonePermission){
        buttonGroupPage.push({
            funcion : addRule,
            nombre : getText("Crear regla",userLanguage),
            icono : <FaPlusCircle style={{margin: "0 10px 0 0"}}/>,
            clase : "successButton"
        })
    }
    if(deleteZonePermission){
        buttonGroupPage.push({
            funcion : deleteRule,
            nombre : getText("Eliminar",userLanguage),
            icono : <FaTrash style={{margin: "0 10px 0 0"}}/>,
            clase : "errorButton"
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
            accounts?
            <CardAccountsSelect onSubmitUpdateZoneRoot={onSubmitUpdateZoneRoot} validateZoneRoot={validateZoneRoot} accounts={accounts} label='Ver reglas' />
            :
            null
        )
    }
    const renderComponent = () =>{
        return(
            <FullComponent
                Titulo={titleRouts}
                Body={TableComponent}
                columns={columns}
                rows={rows}
                buttonGroupPage={buttonGroupPage}
                handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                exportPermission={exportZonePermission}
                isCellEditableFlag={(params) => editableColumns || (createZonePermission && params.row.id === "000-000" ) }
                classGridComponent="tableResponsiveRules"
            />
        )
    }
    return userUserType === 1 && zoneSelectRoot  ? renderCard() : renderComponent();
}

export default Rules;