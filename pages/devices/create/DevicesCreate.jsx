import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import CardComponent from "../../../Components/CardComponent";
import FormAutocompleteComponent from "../../../Components/FormAutocompleteComponent";
import { getDevicesAction, createDevicesAction } from "../../../store/actions/devicesActions";
import { getUnitsAction } from "../../../store/actions/unidadesActions";
import { getGpsModelsAction } from "../../../store/actions/usuarioActions";
import { abrirAlertaCampos } from "../../../config/alerts";
import getText from "../../../config/languages";
import FullComponent from "../../../Components/FullComponent";
import { useRouter } from 'next/router';
import Link from 'next/link';
const DevicesCreate = () => {
    const dispatch = useDispatch();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const Titulo = getText("Crear dispositivo",userLanguage)
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        const pageName = "";
        const prefixName = "Crear dispositivo";
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
        console.log(newRouts);
        sessionStorage.setItem('rout', JSON.stringify(newRouts));
        //setCurrentRouts(routs)
        setTitleRouts(()=>(
        <span>
            {
            newRouts.map((rout,index)=>(
                <Link key={`DevicesCreate_Link_${index}`} href={rout.path} >
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
    const [ movilIdErrorState, setMovilIdErrorState ] = useState('')
    const [ platformErrorState, setPlatformErrorState ] = useState('')
    const [ statusErrorState, setStatusErrorState ] = useState('')
    const [ externalIdErrorState, setExternalIdErrorState ] = useState('')
    const [ gpsModelErrorState, setGpsModelErrorState ] = useState('')
    const [ servicesErrorState, setServicesErrorState ] = useState([])
    const [ unitsErrorState, setUnitsErrorState ] = useState([])
    const [ movilIdState, setMovilIdState ] = useState('')
    const [ platformState, setPlatformState ] = useState('')
    const [ statusState, setStatusState ] = useState('')
    const [ externalIdState, setExternalIdState ] = useState('')
    const [ gpsModelState, setGpsModelState ] = useState('')
    const [ servicesState, setServicesState ] = useState([])
    const [ unitsState, setUnitsState ] = useState([])
    const devices = useSelector(state => state.devices.devices);
    const status = useSelector(state => state.devices.status);
    const platforms = useSelector(state => state.devices.platforms);
    const gps = useSelector(state => state.usuario.gpsModels);
    const services = useSelector(state => state.devices.services);
    const units = useSelector(state => state.unidades.unidades);
    const user = useSelector(state => state.usuario.user);
    const devicesServices = useSelector(state => state.devices.services);
    useEffect(() => {
        //Consultar la api
        if(!devices){
            const loadDevices = () => dispatch( getDevicesAction() );
            loadDevices()
        }
        if(!units){
            const loadUnits = () => dispatch( getUnitsAction() );
            loadUnits()
        }
        if(!gps){
            const loadGPS = () => dispatch( getGpsModelsAction() );
            loadGPS()
        }
    }, [dispatch])
    const [dataInformationComponent, setDataInformationComponent] = useState()
    useEffect(() => {
        if (gps) {
            const statusSelectForm = status.map(state => {
                return {value:state.id,label:getText(state.name,userLanguage)}
            })
            const gpsModelSelectForm = gps.map(gps => {
                return {value:gps.id,label:getText(gps.mark + " " + gps.model,userLanguage)}
            })
            const platformsSelectForm = platforms.map(platform => {
                return {value:platform.id,label:platform.name}
            })
            const servicesSelectForm = services.map(service => {
                return service.name
            })
            const unitsSelectForm = units ? units.map(unit => {
                return {value:unit.vehicleId,label:unit.nick}
            }):[]
            setDataInformationComponent([
                { prop:"MovilId",       fileName:getText("Movil Id",userLanguage),    value:"", state:movilIdState,   setState:setMovilIdState,   errorState:movilIdErrorState,   setErrorState:setMovilIdErrorState,     infoData: getText('Id único del dispositivo. longitud máxima: 30, longitud mínima  3',userLanguage) },
                { prop:"Platform",      fileName:getText("Plataforma",userLanguage),  value:"", state:platformState,  setState:setPlatformState,  errorState:platformErrorState,  setErrorState:setPlatformErrorState,    infoData: '', option: platformsSelectForm },
                { prop:"Status",        fileName:getText("Estatus",userLanguage),     value:"", state:statusState,    setState:setStatusState,    errorState:statusErrorState,    setErrorState:setStatusErrorState,      infoData: '', option: statusSelectForm},
                { prop:"ExternalId",    fileName:getText("Id Externo",userLanguage),  value:"", state:externalIdState,setState:setExternalIdState,errorState:externalIdErrorState,setErrorState:setExternalIdErrorState,  infoData: getText('Id para ligar con sistemas externos',userLanguage) },
                { prop:"GpsModel",      fileName:getText("Modelo GPS",userLanguage),  value:"", state:gpsModelState,  setState:setGpsModelState,  errorState:gpsModelErrorState,  setErrorState:setGpsModelErrorState,    infoData: '', option:gpsModelSelectForm },
                { prop:"Services",      fileName:getText("Servicios",userLanguage),   value:[], state:servicesState,  setState:setServicesState,  errorState:servicesErrorState,  setErrorState:setServicesErrorState,    infoData: '',option:devicesServices.map(ser => {ser.name=getText(ser.name,userLanguage);return ser;}), type:"Autocomplete", },
                { prop:"VehicleId",     fileName:getText("Vehiculo",userLanguage),    value:"", state:unitsState,     setState:setUnitsState,     errorState:unitsErrorState,     setErrorState:setUnitsErrorState,       infoData: '',option:unitsSelectForm },
            ])
        }
    }, [devicesServices,devices, status, gps, platforms, units, services, movilIdState, movilIdErrorState, platformState, platformErrorState, statusState, statusErrorState, externalIdState, externalIdErrorState, gpsModelState, gpsModelErrorState, servicesState, servicesErrorState, unitsState, unitsErrorState])
    useEffect(() => {
    }, [dataInformationComponent])
    const closeForm = (e) => {
        e.preventDefault();
        router.push("/devices");
    }
    const validateFiles = (postDevice) => {
        let errors = "";
        let validatorFlag = true;
        if (postDevice.MovilId.length < 3) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===0){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('El Movil Id debe contener al menos 3 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (postDevice.Platform.length <= 0) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===2){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Campo plataforma requerido',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (postDevice.Status.length <= 0) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===3){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Campo estatus requerido',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (postDevice.GpsModel.length <= 0) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===5){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Campo Modelo GPS requerido',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (!validatorFlag) {
            abrirAlertaCampos('error',`<ul style='list-style: unset;'>${errors}</ul> `)
        }
        return validatorFlag;
    }
    const createDevice = () => {
        const postDevice = {};
        dataInformationComponent.forEach(data => {
            //return { data.prop : data.value }
            if (data.prop === "Services") {
                postDevice["DeviceServices"] = data.value.map(srv => {
                    return {
                        ServiceName: srv,
                        ServiceStatus: true
                    }
                })
            }else{
                postDevice[data.prop] = data.value;
            }
        })
        postDevice["Assigned"] = postDevice["VehicleId"] ? true : false;
        postDevice["accountId"]= user.accountId;
        const validatorFlag = validateFiles(postDevice);
        if(validatorFlag){
            postDevice.Name = "ND";
            dispatch(createDevicesAction(postDevice))
            router.push("/devices");
        }else{

        }
    }
    const buttonGroupFooter = [
        {
            funcion : closeForm,
            nombre : getText("Cancelar",userLanguage),
            icono : null,
            clase : "intralixButton"
        },{
            funcion : createDevice,
            nombre : getText("Registrar Dispositivo",userLanguage),
            icono : null,
            clase : "intralixButton"
        }

    ]
    return (
        <>
            <FullComponent
                Titulo={titleRouts}
            />
            <CardComponent
                Titulo={Titulo}
                Body={FormAutocompleteComponent}
                classComponent="bodyDeviceCreateComponent"
                data={dataInformationComponent}
                setData={setDataInformationComponent}
                buttonGroupFooter={buttonGroupFooter}
            />
        </>
    );
}
export default DevicesCreate;