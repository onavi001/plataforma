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
import { FaPlusCircle, FaTrash, FaDatabase, FaSave } from 'react-icons/fa';
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
const SelectComponentGlobal = ({ index,  field, handleEditCellChangeCommitted, valueOptions, editableColumns=true }) => {
    const [valorSelect, setValorSelect] = useState(index[field]);
    const handleChange = (cellData) => {
        setValorSelect(cellData.value)
        handleEditCellChangeCommitted(cellData)
    };
    return (
        <FormControl variant="standard" style={{width: "100%"}}>
            <Select
                labelId="demo-controlled-open-select-label"
                id={`demo-controlled-open-select_${index}`}
                onChange={e => handleChange({id:index.id,field,value:e.target.value} )}
                value={valorSelect}
                disabled={editableColumns ? false : true}
            >
                {
                    valueOptions.map(opt => (<MenuItem key={`Devices_SelectComponentGlobal_MenuItem_${index}`} value={opt}>{opt}</MenuItem>))
                }
            </Select>
        </FormControl>
    );
};
const SelectComponentDiferentValue = ({ index,  field, handleEditCellChangeCommitted, valueOptions, editableColumns=true,vehicles=undefined }) => {
    const [valorSelect, setValorSelect] = useState(index[field]);
    const [options,setOptions]=useState([])
    useEffect(() => {
        if(field === "vehicleId" && vehicles){
            const currentVehicle = index.vehicleId;
            console.log(currentVehicle)
            console.log(field)
            console.log(index)
            console.log(vehicles)
            console.log(valueOptions)
            const newOptions = [];
            valueOptions.forEach(option => {
                if(option.id === currentVehicle){
                    newOptions.push(option)
                }else{
                    const vehicleFound = vehicles.find(veh => veh.vehicleId === option.id)
                    if(vehicleFound && vehicleFound.gpsDevices.length <= 0){
                        newOptions.push(option)
                    }
                }
            });
            console.log(newOptions)
            setOptions(newOptions)
        }else{
            setOptions(valueOptions)
        }
    }, [vehicles])
    const handleChange = (cellData) => {
        setValorSelect(cellData.value)
        handleEditCellChangeCommitted(cellData)
    };
    return (
        <FormControl variant="standard" style={{width: "100%"}}>
            <Select
                labelId="demo-controlled-open-select-label"
                id={`demo-controlled-open-select_${index}`}
                onChange={e => handleChange({id:index.id,field,value:e.target.value} )}
                value={valorSelect}
                disabled={editableColumns ? false : true}
            >
                {
                    options.map(opt => (<MenuItem key={`Devices_SelectComponentDiferentValue_MenuItem_${index}`} value={opt.id}>{opt.label}</MenuItem>))
                }
            </Select>
        </FormControl>
    );
};
const Devices = () => {
    const dispatch = useDispatch();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        const pageName = "";
        const prefixName = "Dispositivos";
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
                <Link key={`Devices_Link_${index}`} href={rout.path} >
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
    const createDevicePermission = userPermissions.find( per => per.displayName.search("CREATE_DEVICE") >=0)
    const deleteDevicePermission = userPermissions.find( per => per.displayName.search("DELETE_DEVICE") >=0)
    const updateDevicePermission = userPermissions.find( per => per.displayName.search("UPDATE_DEVICE") >=0)
    const exportDevicePermission = userPermissions.find( per => per.displayName.search("EXPORT_DEVICE") >=0)
    const [ arrayDevices, setArrayDevices ] = useState([]);
    const [selectionModel,setSelectionModel] = useState();
    const devices = useSelector(state => state.devices.devices);
    const unidades = useSelector(state => state.unidades.unidades);
    const gps = useSelector(state => state.usuario.gpsModels);
    //useEffect para detectar cambios de estado en reducer de dispositivos
    useEffect(() => {
        //Consultar la api
        if(!devices){
            const loadDevices = () => dispatch( getDevicesAction() );
            loadDevices()
        }
        if(!unidades){
            const loadUnits = () => dispatch( getUnitsAction() );
            loadUnits()
        }
        if(!gps){
            const loadGPS = () => dispatch( getGpsModelsAction() );
            loadGPS()
        }
    }, [])
    const devicesServices = useSelector(state => state.devices.services);
    const platform = useSelector(state => state.devices.platforms);
    const [ devicesUpdate, setDeviceUpdate ] = useState([]);
    const status = useSelector(state => state.devices.status);
    const [ statusDataSelect, setStatusDataSelect ] = useState([])
    const [vehiclesDataSelect,setVehiclesDataSelect] = useState([])
    const [gpsDataSelect,setGpsDataSelect] = useState([])
    const setInitialRows = React.useCallback(
        () => {
            const tempoU = devices.map(device => {
                const currentGPS = gps.find(gp => gp.id === device.gpsModelId );
                const currentVehicle = unidades.find(unidad => unidad.vehicleId === device.vehicleId );
                const stateFound = status.find(state => state.id === device.status)
                return {
                    id : device.id,
                    name : device.name,
                    movilId : device.movilId,
                    vehicleId : device.assigned ? ( (currentVehicle) ? currentVehicle.vehicleId : device.vehicleId ) : "NO",
                    platform : device.platform,
                    status : stateFound ? stateFound.id :  device.status,
                    gpsModelId : (currentGPS) ? currentGPS.id :device.gpsModelId,
                    externalId: device.externalId
                }
            })
            return tempoU;
        },[devices, gps, status, unidades]
    )
    useEffect(() => {
        if (unidades && gps) {
            const gpsTempo = gps.map(gp => {
                return { id:gp.id, label:gp.mark + " " + gp.model }
            })
            console.log(gpsTempo)
            setGpsDataSelect(gpsTempo)
            const unidadesTemp = unidades.map(unidad => {
                return { id:unidad.vehicleId, label:unidad.nick }
            })
            setVehiclesDataSelect(unidadesTemp)
            setRows(setInitialRows())
            const stateTempo = status.map(state => {
                return { id : state.id, label: state.name}
            })
            console.log(stateTempo)
            setStatusDataSelect(stateTempo)
            //setArrayDevices(devices)
        }
    }, [devices, unidades, gps, setInitialRows, status])
    const handleEditCellChangeCommitted = (cellData) => {
        const newDevice = devices.find(device => device.id === cellData.id)
        const currentDeviceUpdate = devicesUpdate.find( deviceUpdate => deviceUpdate.id === cellData.id)
        if (currentDeviceUpdate) {
            const tempo = devicesUpdate.map( deviceUpdate => {
                if (deviceUpdate.id === newDevice.id) {
                    deviceUpdate[cellData.field] = cellData.value;
                }
                return deviceUpdate
            })
            setDeviceUpdate(tempo)
        }else{
            let tempo = devicesUpdate;
            tempo.push({
                id:newDevice.id
            })
            tempo = tempo.map( deviceUpdate => {
                if (deviceUpdate.id === newDevice.id) {
                    deviceUpdate[cellData.field] = cellData.value;
                }
                return deviceUpdate
            })
            setDeviceUpdate(tempo)
        }
        //dispatch(upodateUnitsAction(unidadGet))
        //envoar a reducer
    }
    //Acciones
    const editableColumns = updateDevicePermission || userUserType === 1 ? true : false;
    const ActionsComponent = ({ index }) => {
        const handleEditClick = () => {
            //history.push(`/vehicle/${index.id}`);
        };
        const handleSaveClick = () => {
            //return true;
            if (devicesUpdate.length <= 0) {
                abrirAlertaCampos('warning',getText('No se detectaron cambios',userLanguage))
            }else{
                const deviceToUpdate = devicesUpdate.find( deviceUpdate => deviceUpdate.id === index.id)
                const currentDevice = devices.find( device => device.id === index.id)
                //vehicleId
                if (!deviceToUpdate || !currentDevice) {
                    abrirAlertaCampos('warning',getText('No se encontro dispositivo',userLanguage))
                }else{
                    let flagChangeVehicle = false;
                    let flagChangeDevice = false;
                    if (deviceToUpdate.vehicleId && deviceToUpdate.vehicleId !== currentDevice.vehicleId) {
                        //cambio de unidad
                        flagChangeVehicle = true;
                        //flagChangeDevice = true;
                    }
                    if (
                            (deviceToUpdate.name        && deviceToUpdate.name          !== currentDevice.name) ||
                            (deviceToUpdate.platform    && deviceToUpdate.platform      !== currentDevice.platform) ||
                            (deviceToUpdate.status      && deviceToUpdate.status        !== currentDevice.status) ||
                            (deviceToUpdate.movilId     && deviceToUpdate.movilId       !== currentDevice.movilId) ||
                            (deviceToUpdate.gpsModelId  && deviceToUpdate.gpsModelId    !== currentDevice.gpsModelId) ||
                            (deviceToUpdate.externalId  && deviceToUpdate.externalId    !== currentDevice.externalId) ||
                            deviceToUpdate.services
                        ) {
                        flagChangeDevice = true;
                    }
                    if (!flagChangeDevice && !flagChangeVehicle) {
                        abrirAlertaCampos('warning',getText('No se detectaron cambios',userLanguage))
                    }else{
                        //armar objecto para hacer update
                        const updateDeviceSend = {
                            //DeviceId : deviceToUpdate.id,
                            Status : deviceToUpdate.status ? deviceToUpdate.status : currentDevice.status,
                            ExternalId : deviceToUpdate.externalId ? deviceToUpdate.externalId : currentDevice.externalId,
                            MovilId : deviceToUpdate.movilId ? deviceToUpdate.movilId : currentDevice.movilId,
                            Name : deviceToUpdate.name ? deviceToUpdate.name : currentDevice.name,
                            Platform : deviceToUpdate.platform ? deviceToUpdate.platform : currentDevice.platform,
                            GpsModel: deviceToUpdate.gpsModelId ? deviceToUpdate.gpsModelId : currentDevice.gpsModelId,
                            DeviceServices : deviceToUpdate.services ? deviceToUpdate.services.map(serv => {
                                return {
                                        serviceName: serv.serviceName,
                                        status: serv.status
                                    }
                            }) : currentDevice.services
                        }
                        const dataVehicleChange = {
                            MovilId : currentDevice.movilId,
                            oldVehicleId : currentDevice.vehicleId,
                            newVehicleId : deviceToUpdate.vehicleId,
                        }
                        currentDevice.name = updateDeviceSend.Name;
                        currentDevice.platform = updateDeviceSend.Platform;
                        currentDevice.status = updateDeviceSend.Status;
                        currentDevice.gpsModelId = updateDeviceSend.GpsModel;
                        currentDevice.services = deviceToUpdate.services ? deviceToUpdate.services.map(serv => {
                            return {
                                    serviceName: serv.serviceName,
                                    status: serv.status
                                }
                        }) : currentDevice.services;
                        currentDevice.vehicleId = deviceToUpdate.vehicleId ? deviceToUpdate.vehicleId : currentDevice.vehicleId;
                        const reduxDeviceUpdate = currentDevice;
                        reduxDeviceUpdate.services=updateDeviceSend.DeviceServices;
                        reduxDeviceUpdate.externalId=updateDeviceSend.ExternalId;
                        reduxDeviceUpdate.gpsModelId=updateDeviceSend.GpsModel;
                        reduxDeviceUpdate.movilId=updateDeviceSend.MovilId;
                        reduxDeviceUpdate.name=updateDeviceSend.Name;
                        reduxDeviceUpdate.platform=updateDeviceSend.Platform;
                        reduxDeviceUpdate.status=updateDeviceSend.Status;
                        dispatch( updateDevicesAction(updateDeviceSend,currentDevice.accountId,currentDevice,dataVehicleChange,flagChangeDevice,flagChangeVehicle,reduxDeviceUpdate) )
                    }
                }
            }
        }
        return (
            <>
                <div className="tooltip" style={{right: "10px"}} >
                    <MouseOverPopover text='' hoverText={getText('ACTUALIZAR INFORMACIÓN',userLanguage)} icon={(<FaDatabase size={20} color="" style={{padding:"5px"}} onClick={handleEditClick}  />)} />
                </div>
                {
                    updateDevicePermission || userUserType === 1 ?
                        <div className="tooltip" style={{right: "50px"}} >
                            <MouseOverPopover text='' hoverText={getText('ACTUALIZAR INFORMACIÓN',userLanguage)} icon={(<FaSave size={20} color="" style={{padding:"5px"}} onClick={handleSaveClick}  />)} />
                        </div>
                    :null
                }
            </>
        );
    };
    const ServiceComponent = ({ index }) => {
        const RefCheckBoxGroup = React.useRef();
        const device = devices.find(unidad => unidad.id === index.id)
        const armarServices = () => {
            const services = {};
            device.services.forEach(service => {
                services[service.serviceName] = service.status
            });
            return services;
        }
        const devService = device ? armarServices() : []
        const handleEditClick = (event,value) => {
            event.preventDefault()
            const valueIds = value.map(val => val.id)
            let valueTemp = undefined;
            valueIds.forEach(val => {
                if (!device.services.find(service => service.serviceName === val)) {
                    valueTemp = val;
                }
            })
            if (valueTemp) {
                device.services.push({serviceName:valueTemp,status:true})
            }
            device.services = device.services.map(service => {
                if (valueIds.find(val => val === service.serviceName )) {
                    service.status = true;
                }else{
                    service.status = false;
                }
                return service;
            })

            const newDevice = arrayDevices.map(dev => {
                if (dev.id === device.id) {
                    return device;
                }else{
                    return dev;
                }
            })
            setArrayDevices(newDevice)
            const currentDeviceUpdate = devicesUpdate.find( deviceUpdate => deviceUpdate.id === device.id)
            if (currentDeviceUpdate) {
                const tempo = devicesUpdate.map( deviceUpdate => {
                    if (deviceUpdate.id === device.id) {
                        deviceUpdate.services = device.services;
                    }
                    return deviceUpdate
                })
                setDeviceUpdate(tempo)
            }else{
                let tempo = devicesUpdate;
                tempo.push({
                    id:device.id
                })
                tempo = tempo.map( deviceUpdate => {
                    if (deviceUpdate.id === device.id) {
                        deviceUpdate.services = device.services;
                    }
                    return deviceUpdate
                })
                setDeviceUpdate(tempo)
            }
        };
        const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
        const checkedIcon = <CheckBoxIcon fontSize="small" />;
        return (
                <Autocomplete
                    ref={RefCheckBoxGroup}
                    style={{ width: 300 }}
                    multiple
                    id="checkboxes-tags-demo"
                    options={devicesServices}
                    disabled={editableColumns ? false : true}
                    onChange = {(event,value) => handleEditClick(event,value) }
                    limitTags={2}
                    disableCloseOnSelect={true}
                    defaultValue={
                        Object.keys(devService).filter((prop) => devService[prop] ).map(element => {
                            return devicesServices.find(ele => ele.id === element);
                        })
                    }
                    getOptionLabel={(option) => getText(option.name,userLanguage)}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {getText(option.name,userLanguage)}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} variant="standard" label="" placeholder="" />
                    )}
                />
        );
    }
    const columns = [
        {
            field: 'id',
            headerName: 'id',
            width: 100,
            hide: true
        },{
            field: 'movilId',
            headerName: getText('Movil Id',userLanguage),
            editable: false,
            flex: 1,
            minWidth: 150,
        },{
            field: 'vehicleId',
            headerName: getText('Vehiculo',userLanguage),
            sortable: false,
            editable: editableColumns,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <SelectComponentDiferentValue
                            index={params.row}
                            field='vehicleId'
                            handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                            valueOptions={vehiclesDataSelect}
                            editableColumns={editableColumns}
                            vehicles={unidades}
                        />
                    </div>
                );
            },
            minWidth: 160,
        },{
            field: 'gpsModelId',
            headerName: getText('GPS',userLanguage),
            sortable: false,
            editable: editableColumns,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <SelectComponentDiferentValue
                            index={params.row}
                            field='gpsModelId'
                            handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                            valueOptions={gpsDataSelect.map(gps => {
                                gps.label = getText(gps.label,userLanguage);
                                return gps;
                            })}
                            editableColumns={editableColumns}
                        />
                    </div>
                );
            },
            minWidth: 200
        },{
            field: 'platform',
            headerName: getText('Plataforma',userLanguage),
            sortable: false,
            editable: editableColumns,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <SelectComponentGlobal
                            index={params.row}
                            field='platform'
                            handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                            valueOptions={platform.map(plat => (plat.name))} 
                            editableColumns={editableColumns}
                        />
                    </div>
                );
            },
        },{
            field: 'services',
            headerName: getText('Servicios',userLanguage),
            editable: false,
            minWidth: 310,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} className="deviceChip" >
                        <ServiceComponent index={params.row} editableColumns={editableColumns} />
                    </div>
                );
            }
        },{
            field: 'status',
            headerName: getText('Estatus',userLanguage),
            width: 120,
            editable: editableColumns,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }} >
                        <SelectComponentDiferentValue
                            index={params.row}
                            field='status'
                            handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                            valueOptions={statusDataSelect.map(sta => {
                                sta.label = getText(sta.label,userLanguage);
                                return sta;
                            })}
                            editableColumns={editableColumns}
                        />
                    </div>
                );
            }
        },{
            field: 'externalId',
            headerName: getText('Id Externo',userLanguage),
            width: 120,
            minWidth: 150,
            editable: editableColumns,
        },{
            field: "actions",
            headerName: getText("Acciones",userLanguage),
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer", display: "contents" }} >
                        <ActionsComponent index={params.row} />
                    </div>
                );
            },
            width: 140
        }
    ];
    const [rows, setRows ] = useState()
    const Titulo = getText("Dispositivos",userLanguage)
    const registerDevicesFunction = (e) => {
        e.preventDefault();
        router.push("/devices/create");
    }
    const unlockDevicesFunction = (e) => {
        e.preventDefault();
        if (!selectionModel || selectionModel.length <= 0) {
            abrirAlertaCampos('warning',getText('Seleccione al menos un dispositivo',userLanguage))
        }else{
            const arrayMovilIds = [];
            devices.forEach(device => {
                if (selectionModel.find(id => id === device.id)) {
                    arrayMovilIds.push(device.movilId)
                }
            });
            dispatch(deleteDevicesAction(arrayMovilIds,0))
        }
    }
    const buttonGroupPage = []
    if (createDevicePermission || userUserType === 1) {
        buttonGroupPage.push({
            funcion : registerDevicesFunction,
            nombre : getText("Registrar dispositivos",userLanguage),
            icono : <FaPlusCircle style={{margin: "0 10px 0 0"}}/>,
            clase : "successButton"
        })
    }
    if(deleteDevicePermission || userUserType === 1){
        buttonGroupPage.push({
            funcion : unlockDevicesFunction,
            nombre : getText("Liberar dispositivos",userLanguage),
            icono : <FaTrash style={{margin: "0 10px 0 0"}}/>,
            clase : "errorButton"
        })
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
                classGridComponent="tableResponsiveDevices"
                exportPermission={exportDevicePermission || userUserType === 1 ? true : false}
            />
        </div>
    );
}
export default Devices;

const typeServices = [
    'Combustible',
    'Temperatura'
];