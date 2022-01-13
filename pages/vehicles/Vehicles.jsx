import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FullComponent from "../../Components/FullComponent";
import TableComponent from "../../Components/TableComponent";
//import MenuItem from '@mu/core/MenuItem';
//import Select from '@material-ui/core/Select';
//import FormControl from '@material-ui/core/FormControl';
import { FaEye, FaSave, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { getUnitsAction, upodateUnitsAction, deleteUnitsAction } from "../../store/actions/unidadesActions";
import { getDevicesAction } from "../../store/actions/devicesActions";
import { abrirAlertaCampos } from "../../config/alerts";

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import getText from "../../config/languages";
//
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//
import { useRouter } from 'next/router';
import Link from 'next/link';
const Vehicles = () => {
    const dispatch = useDispatch();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        const pageName = "";
        const prefixName = "Vehiculos";
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
                <Link key={`Vehicles_Link_${index}`} href={rout.path} >
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
    const userPermissions = useSelector(state => state.usuario.permissions);
    const userUserType = useSelector(state => state.usuario.userType);
    const createVehiclePermission = userPermissions.find( per => per.displayName.search("CREATE_VEHICLE") >=0)
    const deleteVehiclePermission = userPermissions.find( per => per.displayName.search("DELETE_VEHICLE") >=0)
    const updateVehiclePermission = userPermissions.find( per => per.displayName.search("UPDATE_VEHICLE") >=0)
    const exportVehiclePermission = userPermissions.find( per => per.displayName.search("EXPORT_VEHICLE") >=0)
    const undiadesTypes = useSelector(state => state.unidades.Types);
    const undiadesMarks = useSelector(state => state.unidades.Marks);
    const undiadesModels = useSelector(state => state.unidades.Models);
    const unidadesStatus = useSelector(state => state.unidades.status);
    const [selectionModel,setSelectionModel] = useState();
    const vehicles = useSelector(state => state.unidades.unidades);
    const devices = useSelector(state => state.devices.devices);
    useEffect(() => {
        //Consultar la api
        if(!vehicles){
            const loadVehicles = () => dispatch( getUnitsAction() );
            loadVehicles()
        }
        if(!devices){
            const loadDevices = () => dispatch( getDevicesAction() )
            loadDevices()
        }
    }, [dispatch])
    let [vehiclesChange,setvehiclesChange] = useState([]);
    const setInitialRows = React.useCallback(
        () => {
            const tempoU = vehicles.map(vehicle => {
                const temp = undiadesModels.filter(model => model.parentMark === vehicle.mark);
                //index['optionsModel'] = temp.map(type => ({value:type.id, label:type.name}))
                console.log(vehicle)
                return {
                    id : vehicle.vehicleId,
                    nick : vehicle.nick,
                    mark : vehicle.mark,
                    model : vehicle.model,
                    color : vehicle.color,
                    plates : vehicle.plates,
                    year : vehicle.year,
                    type : vehicle.type,
                    status : vehicle.status,
                    vin : vehicle.vin,
                    devices_name:vehicle.gpsDevices,
                    optionsModel:temp.map(type => ({value:type.id, label:type.name})),
                }
            })
            console.log("initial rows")
            console.log(tempoU)
            return tempoU;
        },[undiadesModels, vehicles]
    )
    useEffect(() => {
        if(vehicles && devices){
            setRows(setInitialRows()) 
        }
    }, [vehicles, devices])
    const handleEditCellChangeCommitted = (cellData) => {
        /*const vehicleFound = vehiclesChange.find(vehicle => vehicle.id === cellData.id)
        if (vehicleFound) {
            vehicleFound[cellData.field] = cellData.value;
            const temp = vehiclesChange.map(vehicle => {
                if (vehicle.id === vehicleFound.id) {
                    return vehicleFound;
                }else{
                    return vehicle;
                }
            })
            setvehiclesChange(temp);
        }else{
            const temp = vehiclesChange;
            temp.push({id:cellData.id, [cellData.field]:cellData.value})
            setvehiclesChange(temp);
        }*/
        console.log("cellData")
        console.log(cellData)
        const vehicleFound = vehiclesChange.find(vehicle => vehicle.id === cellData.id)
        if(cellData.field === "status" || cellData.field === "gpsDevices"){
            console.log(vehiclesChange)

        }
        if (vehicleFound) {
            vehicleFound[cellData.field] = cellData.value;
            const temp = vehiclesChange.map(vehicle => {
                if (vehicle.id === vehicleFound.id) {
                    return vehicleFound;
                }else{
                    return vehicle;
                }
            })
            vehiclesChange = temp;
        }else{
            const temp = vehiclesChange;
            temp.push({id:cellData.id, [cellData.field]:cellData.value})
            vehiclesChange = temp;
        }
    }
    //Acciones
    const editableColumns = updateVehiclePermission || userUserType === 1 ? true : false;
    const ActionsComponent = ({ index }) => {
        const handleSaveClick = () => {
            const newVehicle = vehiclesChange.find(vehicle => vehicle.id === index.id)
            if(newVehicle){
                const oldVehicle = vehicles.find(vehicle => vehicle.vehicleId === index.id)
                const vehicleUpdate = {
                    "VehicleId" : oldVehicle.vehicleId,
                    "Nick" : newVehicle.nick ? newVehicle.nick : oldVehicle.nick,
                    "Mark" : newVehicle.mark ? newVehicle.mark : oldVehicle.mark,
                    "Model" : newVehicle.model ? newVehicle.model : oldVehicle.model,
                    "Color" : newVehicle.color ? newVehicle.color : oldVehicle.color,
                    "Year" : newVehicle.year ? newVehicle.year : oldVehicle.year,
                    "Type" : newVehicle.type ? newVehicle.type : oldVehicle.type,
                    "Plates": newVehicle.plates ? newVehicle.plates : oldVehicle.plates,
                    "VIN" : newVehicle.vin ? newVehicle.vin : oldVehicle.vin,
                    "Status" : newVehicle.status ? newVehicle.status : oldVehicle.status,
                    "Efficiency" : 0.0,
                    "Details" : "N/D",
                    "Devices" : newVehicle.gpsDevices ? newVehicle.gpsDevices : oldVehicle.gpsDevices,
                }
                const vehicleRedux = vehicles.find(vehicle => vehicle.vehicleId === index.id)
                vehicleRedux.nick = newVehicle.nick ? newVehicle.nick : oldVehicle.nick;
                vehicleRedux.mark = newVehicle.mark ? newVehicle.mark : oldVehicle.mark;
                vehicleRedux.model = newVehicle.model ? newVehicle.model : oldVehicle.model;
                vehicleRedux.color = newVehicle.color ? newVehicle.color : oldVehicle.color;
                vehicleRedux.year = newVehicle.year ? parseInt(newVehicle.year) : parseInt(oldVehicle.year);
                vehicleRedux.type = newVehicle.type ? newVehicle.type : oldVehicle.type;
                vehicleRedux.plates = newVehicle.plates ? newVehicle.plates : oldVehicle.plates;
                vehicleRedux.vin = newVehicle.vin ? newVehicle.vin : oldVehicle.vin;
                vehicleRedux.status = newVehicle.status ? newVehicle.status : oldVehicle.status;
                vehicleRedux.gpsDevices = newVehicle.gpsDevices ? newVehicle.gpsDevices : oldVehicle.gpsDevices;
                dispatch(upodateUnitsAction(vehicleUpdate,vehicleRedux))
            }else{
                abrirAlertaCampos('error',`No se encotraron cambios`)
            }
        }
        return (
            <>
                {
                    editableColumns ?
                        <div className="tooltip" style={{right: "10px"}} >
                            <FaSave size={20} color="" style={{padding:"5px"}} onClick={handleSaveClick} />
                            <span className="tooltiptext" >Guardar</span>
                        </div>
                    :null
                }
            </>
        );
    };
    //devices
    const DevicesComponent = ({ index }) => {
        const RefCheckBoxGroup = React.useRef();
        const setInitialValues = () => {
            const vehicleChangeFound = vehiclesChange.find(vehicleChange => vehicleChange.id === index.id)
            if(vehicleChangeFound && vehicleChangeFound.gpsDevices){
                return (vehicleChangeFound.gpsDevices)
            }else{
                return vehicles ? vehicles.find(vehicle => vehicle.vehicleId === index.id) ? vehicles.find(vehicle => vehicle.vehicleId === index.id).gpsDevices : [] : []
            }
        }
        const [ gpsDevices] = useState(setInitialValues);
        const [options,setOptions]= useState(devices.map(device => (device.movilId)))
        const handleEditClick = (event,value) => {
            console.log(value)
            event.preventDefault()
            const data = {
                field:"gpsDevices",
                id:index.id,
                value:value
            }
            handleEditCellChangeCommitted(data)
            if(value.length > 0){
                if(index.status === "sin GPS"){
                    const data = {
                        field:'status',
                        id:index.id,
                        value:"Activo"
                    }
                    handleEditCellChangeCommitted(data)
                    setRows(rows.map(row=>{
                        if(row.id === index.id){
                            row['status']='Activo';
                        }
                        return row;
                    }))
                }
            }else{
                const data = {
                    field:'status',
                    id:index.id,
                    value:"sin GPS"
                }
                handleEditCellChangeCommitted(data)
                setRows(rows.map(row=>{
                    if(row.id === index.id){
                        row['status']='sin GPS';
                    }
                    return row;
                }))
            }
        };
        useEffect(() => {
            //console.log(devices.map(device => (device.movilId)))
            //vehiclesChange.find(vehicleChange => vehicleChange.id === index.id)
            let newOptions = [];
            const devicesFromCH = vehiclesChange.map(vehicleChange => ( {
                id : vehicleChange.id,
                gpsDevices : vehicleChange.gpsDevices,
            }))
            const devicesFromV = vehicles.map(vehicle => ({
                id : vehicle.vehicleId,
                gpsDevices : vehicle.gpsDevices,
            }))
            const twoDevices = devicesFromCH;
            devicesFromV.forEach(element => {
                if(!twoDevices.find(dev => dev.id === element.id)){
                    twoDevices.push(element)
                }
            });
            const myDevices = devicesFromV.find(dev => dev.id === index.id);
            if(myDevices){
                newOptions=myDevices.gpsDevices
            }
            devices.forEach(device => {
                //element.movilId
                let flag=false;
                devicesFromV.forEach(element => {
                    if(element && element.gpsDevices && element.gpsDevices.length > 0){
                        if(element.gpsDevices.find(dev => dev === device.movilId)){
                            flag=true;
                        }
                    }
                });
                if(!flag){
                    //  newOptions.push(element.movilId)
                    newOptions=[...newOptions,device.movilId]
                }
            });
            setOptions(newOptions)
        }, [])
        const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
        const checkedIcon = <CheckBoxIcon fontSize="small" />;
        return (
                <Autocomplete
                    ref={RefCheckBoxGroup}
                    style={{ width: 320 }}
                    multiple
                    id="checkboxes-tags-demo"
                    options={options}
                    disabled={editableColumns ? false : true}
                    //filterOptions={filterOptions}
                    onChange = {(event,value) => handleEditClick(event,value) }
                    limitTags={2}
                    disableCloseOnSelect={true}
                    defaultValue={
                        gpsDevices
                    }
                    getOptionLabel={(option) => option}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} variant="standard" label="" placeholder="" />
                    )}
                />
        );
    }
    const SelectComponentGlobal = ({ index,  field, handleEditCellChangeCommitted, valueOptions, editableColumns }) => {
        const [valorSelect, setValorSelect] = useState(index[field]);
        //index['optionsModel'] = valueOptions;
        useEffect(() => {
                if(index['mark']){
                    const temp = undiadesModels.filter(model => model.parentMark === index['mark']);
                    index['optionsModel'] = temp.map(type => ({value:type.id, label:type.name}))
                    //setValueOptionsFilter(temp.map(type => ({value:type.id, label:type.name})))
                }
        }, [index])
        const handleChange = (cellData) => {
            console.log("cellData")
            console.log(cellData)
            if(field === 'mark'){
                setValorSelect(cellData.props.value);
                const data = {
                    field:cellData.field,
                    id:cellData.id,
                    value:cellData.props.value
                }
                handleEditCellChangeCommitted(data)
                const temp = undiadesModels.filter(model => model.parentMark === cellData.props.value);
                index['optionsModel'] = temp.map(type => ({value:type.id, label:type.name}));
                setRows(rows.map(row=>{
                    if(row.id === index['id']){
                        row.model='';
                        row.mark=cellData.props.value;
                        //row.optionsModel=temp.map(type => ({value:type.id, label:type.name}))
                    }
                }))
            }else if(field === 'status'){
                console.log(vehiclesChange)
                const currentVehicleChange = vehiclesChange.find(vc => vc.id === index['id'])
                if (index['devices_name'].length > 0) {
                    if(currentVehicleChange){
                        if(!currentVehicleChange.gpsDevices){
                            if(cellData.props.value !== 'sin GPS'){
                                setValorSelect(cellData.props.value);
                                const data = {
                                    field:cellData.field,
                                    id:cellData.id,
                                    value:cellData.props.value
                                }
                                handleEditCellChangeCommitted(data)
                                setRows(rows.map(row=>{
                                    if(row.id === index['id']){
                                        row[field]=cellData.props.value;
                                    }
                                    return row;
                                }))
                            }
                        }
                    }else{
                        if(cellData.props.value !== 'sin GPS'){
                            setValorSelect(cellData.props.value);
                            const data = {
                                field:cellData.field,
                                id:cellData.id,
                                value:cellData.props.value
                            }
                            handleEditCellChangeCommitted(data)
                            setRows(rows.map(row=>{
                                if(row.id === index['id']){
                                    row[field]=cellData.props.value;
                                }
                                return row;
                            }))
                        }
                    }
                }
                if(currentVehicleChange && currentVehicleChange.gpsDevices && currentVehicleChange.gpsDevices.length > 0){
                    if(cellData.props.value !== 'sin GPS'){
                        setValorSelect(cellData.props.value);
                        const data = {
                            field:cellData.field,
                            id:cellData.id,
                            value:cellData.props.value
                        }
                        handleEditCellChangeCommitted(data)
                        setRows(rows.map(row=>{
                            if(row.id === index['id']){
                                row[field]=cellData.props.value;
                            }
                            return row;
                        }))
                    }
                }
            }else{
                setValorSelect(cellData.props.value);
                const data = {
                    field:cellData.field,
                    id:cellData.id,
                    value:cellData.props.value
                }
                handleEditCellChangeCommitted(data)
                console.log("data")
                console.log(data)
                setRows(rows.map(row=>{
                    if(row.id === index['id']){
                        row[field]=cellData.props.value;
                    }
                    const vehicleChangeFound = vehiclesChange.find(vehicleChange => vehicleChange.id === row.id)
                    if(vehicleChangeFound){
                        Object.keys(vehicleChangeFound).forEach((prop) => {
                            if(prop !== field){
                                console.log(vehicleChangeFound[prop]);
                                console.log(prop)
                            }
                        })
                    }
                    return row;
                }))
            }
        };
        return (
            <FormControl variant="standard" style={{width: "100%"}}>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id={`demo-controlled-open-select_${index}`}
                    onChange={e => handleChange({id:index.id,field,props:{value:e.target.value}} )}
                    value={valorSelect}
                    disabled={editableColumns ? false : true}
                >
                    {
                        field === 'model'?
                        index['optionsModel'].map((opt,index) => (<MenuItem key={`Vehicles_MenuItem_SelectComponentGlobal_1_${field}_${index}`} value={opt.value}>{opt.label}</MenuItem>))
                        :
                        valueOptions.map((opt,index) =>
                            (<MenuItem key={`Vehicles_MenuItem_SelectComponentGlobal_2_${field}_${index}`} value={opt.value} >{opt.label}</MenuItem>)
                        )
                    }
                </Select>
            </FormControl>
        );
    };
    const columns = [
        {
            field: 'id',
            headerName: 'id',
            width: 100,
            hide: true
        },{
            field: 'nick',
            headerName: getText('Nick',userLanguage),
            sortable: false,
            flex:1,
            minWidth: 100,
            editable: editableColumns,
        },{
            field: 'mark',
            headerName: getText('Marca',userLanguage),
            sortable: false,
            flex:1,
            minWidth: 100,
            editable: true,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <SelectComponentGlobal
                            index={params.row}
                            field='mark'
                            editableColumns={editableColumns}
                            handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                            valueOptions={undiadesMarks.map(type => ({value:type.id, label:type.name}))} />
                    </div>
                );
            }
        },{
            field: 'model',
            headerName: getText('Modelo',userLanguage),
            sortable: false,
            minWidth: 120,
            flex:1,
            editable: true,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <SelectComponentGlobal
                            index={params.row}
                            field='model'
                            editableColumns={editableColumns}
                            handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                            valueOptions={undiadesModels.map(type => ({value:type.id, label:type.name}))} />
                    </div>
                );
            }
        },{
            field: 'color',
            headerName: getText('Color',userLanguage),
            sortable: false,
            minWidth: 50,
            editable: editableColumns,
        },{
            field: 'plates',
            headerName: getText('Placas',userLanguage),
            sortable: false,
            minWidth: 50,
            editable: editableColumns,
        },{
            field: 'year',
            headerName: getText('Año',userLanguage),
            //type: 'number',
            //flex: 1,
            minWidth: 80,
            sortable: false,
            editable: editableColumns,
        },{
            field: 'type',
            headerName: getText('Tipo',userLanguage),
            sortable: false,
            editable: true,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <SelectComponentGlobal 
                            index={params.row}
                            field='type'
                            editableColumns={editableColumns}
                            handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                            valueOptions={undiadesTypes.map(type => ({value:type.id, label:getText(type.name,userLanguage)}))} />
                    </div>
                );
            }
        },{
            field: 'status',
            headerName: getText('Estatus',userLanguage),
            editable: true,
            sortable: false,
            minWidth: 50,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <SelectComponentGlobal
                            index={params.row}
                            field='status'
                            editableColumns={editableColumns}
                            handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                            valueOptions={unidadesStatus.map(type => ({value:type.id, label:getText(type.name,userLanguage)}))} />
                    </div>
                );
            }
        },{
            field: 'vin',
            headerName: getText('No. Serie',userLanguage),
            sortable: false,
            minWidth: 50,
            editable: editableColumns,
        },{
            field: 'devices_name',
            headerName: getText('GPS',userLanguage),
            sortable: true,
            disableClickEventBubbling: true,
            minWidth: 330,
            maxWidth: 330,
            Width: 330,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} className="vehicleChip" >
                        <DevicesComponent index={params.row} />
                    </div>
                );
            }
        },{
            field: "actions",
            headerName: getText("Acciones",userLanguage),
            minWidth: 100,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer", display: "contents" }} >
                        <ActionsComponent index={params.row} />
                    </div>
                );
            }
        }
    ];
    const [rows, setRows ] = useState()
    const Titulo = "Unidades Registradas"
    const registerUnitsFunction = (e) => {
        e.preventDefault();
        router.push("/vehicles/create");
    }
    const unsubscribeUnitsFunction = (e) => {
        e.preventDefault();
        if (!selectionModel || selectionModel.length <= 0) {
            abrirAlertaCampos('warning','Seleccione al menos una unidad')
        }else{
            dispatch(deleteUnitsAction(selectionModel,0))
        }
    }
    const buttonGroupPage = []
    if (createVehiclePermission || userUserType === 1 ) {
        buttonGroupPage.push({
            funcion : registerUnitsFunction,
            nombre : getText("Registrar Unidad",userLanguage),
            icono : <FaPlusCircle style={{margin: "0 10px 0 0"}}/>,
            clase : "successButton"
        });
    }
    if(deleteVehiclePermission || userUserType === 1 ){
        buttonGroupPage.push({
            funcion : unsubscribeUnitsFunction,
            nombre : getText("Eliminar",userLanguage),
            icono : <FaTrash style={{margin: "0 10px 0 0"}}/>,
            clase : "errorButton"
        });
    }
    return (
        <div style={{ height: 400, width: '100%' }}>
                <FullComponent
                    Titulo={titleRouts}
                    Body={TableComponent}
                    columns={columns}
                    rows={rows}
                    buttonGroupPage={buttonGroupPage}
                    handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                    selectionModel={selectionModel}
                    setSelectionModel={setSelectionModel}
                    classGridComponent="tableResponsiveVehicles"
                    exportPermission={exportVehiclePermission || userUserType === 1 ? true : false}
                />
        </div>
    );
}
export default Vehicles;