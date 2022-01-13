import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import CardUnitsComponent from "./CardUnitsComponent";
import FullComponent from "../../../../../Components/FullComponent";
import { getClassificationsAction} from "../../../../../store/actions/zonesActions";
import { getUnitsAction } from "../../../../../store/actions/unidadesActions";
import { getDevicesAction } from "../../../../../store/actions/devicesActions";
import Grid from "@material-ui/core/Grid";
import ConfirmDIalogComponent from "../../../../../Components/ConfirmDialogComponent";
import InformationComponent from "../../../../../Components/InformationComponent";
import Chip from '@mui/material/Chip';
import FuelVehicleComponent from "../../../../../Components/FuelVehicleComponent";
import TravelComponent from "../../../../../Components/TravelComponent";
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import { FaSearch } from 'react-icons/fa';
//import '../style/regions.scss'
//import '../style/zone.scss'
import getText from "../../../../../config/languages";
import { useRouter } from 'next/router';
import Link from 'next/link';
const ZonesGet = ({...pageProps}) => {
    const dispatch = useDispatch()
    const router = useRouter();
    const { id } =  pageProps.router.query
    const { globalAccountId } =  pageProps.router.query
    const { globalExternalAccountId }=  pageProps.router.query
    const classifications = useSelector(state => state.zones.classifications);
    const vehicles = useSelector(state => state.unidades.unidades);
    const devices = useSelector(state => state.devices.devices);
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        if(classifications && vehicles && devices){
            const classificationFound = classifications.find(classification => classification.id === id);
            if(classificationFound){
                const pathname = window.location.pathname;
                const pageName = classificationFound.alias;
                const prefixName = "Zona";
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
                        <Link key={`ZonesGet_Link_${index}`} href={rout.path} >
                        <a className={index !== newRouts.length - 1 ? 'currenHeaderLink' : 'headerLink'} style={{margin: "-4px 0 0 5px"}}>
                            {index > 0 ? ' / ':null}
                            {`${getText(rout.prefix,userLanguage)} ${rout.name?': '+rout.name:''}`}
                        </a>
                        </Link>
                    ))
                    }
                </span>
                ))
            }
        }
    }, [classifications, id, vehicles,devices])
    const [title,setTitle] = useState("")
    const user = useSelector(state => state.usuario.user);
    const undiadesTypes = useSelector(state => state.unidades.Types);
    const undiadesMarks = useSelector(state => state.unidades.Marks);
    const undiadesModels = useSelector(state => state.unidades.Models);
    const unidadesStatus = useSelector(state => state.unidades.status);
    const [vehiclesCard,setVehiclesCard]=useState([])
    useEffect(() => {
        if(!classifications){
            const loadClassifications = () => dispatch( getClassificationsAction(globalAccountId) );
            loadClassifications()
        }
        if(!vehicles){
            const loadVehicles = () => dispatch( getUnitsAction() );
            loadVehicles()
        }
        if(!devices){
            const loadDevices = () => dispatch( getDevicesAction() );
            loadDevices()
        }
    }, [dispatch, globalAccountId])
    useEffect(() => {
        if(classifications && vehicles && devices){
            const classificationFound = classifications.find(classification => classification.id === id);
            if(classificationFound){
                setTitle(classificationFound.alias)
            }
            let temp =(vehicles.map((vehicles,index)=>{
                console.log('index')
                console.log(index)
                const timeStop = Math.floor(Math.random() * 50);
                const lastPosition = Math.floor(Math.random() * 50);
                let classHeader = 'unitStatusGreen';
                if(timeStop > 12){
                    classHeader="unitStatusOrange";
                }
                if(timeStop > 24){
                    classHeader="unitStatusRed"
                }
                return{
                    vehicleId: vehicles.vehicleId,
                    name : vehicles.nick,
                    timeStop,
                    lastPosition,
                    classHeader,
                    actionShow:vehicleToShow
                }
            }))
            function compare( a, b ) {
                if ( a.timeStop > b.timeStop ){
                    return -1;
                }
                if ( a.timeStop < b.timeStop ){
                    return 1;
                }
                return 0;
            }
            temp.sort( compare );
            console.log(temp)
            setVehiclesCard(temp)
        }
    }, [classifications, id, vehicles,devices])
    const buttonGroupPage = [{
        funcion : ()=>{router.push(`/regions`);},
        nombre : "Regresar",
        icono : null,
        clase : "neutroButton"
    }]
    const vehicleToShow = (e,vehicleId,typeComponent) => {
        e.preventDefault();
        console.log(vehicleId)
        const vehicle = vehicles.find(vehicle => vehicle.vehicleId === vehicleId);
        setCurrentVehicle(vehicle)
        if(vehicle){
            //setCurrentVehicle(vehicle)
            setOpen(true)
            setType(typeComponent)
            if(typeComponent === 1){
                setTittleDialog(vehicle.nick);
            }else if(typeComponent === 2){
                setTittleDialog(`Combustible : ${vehicle.nick}`);
            }else if(typeComponent === 3){
                setTittleDialog(`Ultima posición : ${vehicle.nick}`);
            }else if(typeComponent === 4){
                setTittleDialog(`Temperatura : ${vehicle.nick}`);
            }else if(typeComponent === 5){
                setTittleDialog(`Viaje : ${vehicle.nick}`);
            }
            //setBodyShowDataVehicle(()=>(<p></p>))
        }
    }
    const bodyShowBasicData=()=>{
        if(currentVehicle){
            const data=[];
            data.push({prop:"nick", fileName:'Nombre',value:currentVehicle['nick']})
            data.push({prop:"mark", fileName:'Marca',value:currentVehicle['mark']})
            data.push({prop:"model", fileName:'Modelo',value:currentVehicle['model']})
            data.push({prop:"plates", fileName:'Placas',value:currentVehicle['plates']})
            data.push({prop:"status", fileName:'Estado',value:currentVehicle['status']})
            console.log(currentVehicle['gpsDevices'])
            console.log(currentVehicle)
            if(currentVehicle['gpsDevices'].length > 0){
                if(currentVehicle['gpsDevices'].length > 1){
                    const temp = ()=>(
                        <>
                            {
                                currentVehicle['gpsDevices'].map((dev,index) => (
                                    <Chip key={`ZonesGet_Chip_${index}`} label={dev} color="success" variant="outlined" className="muiChip-device" />
                                ))
                            }
                        </>
                    );
                    data.push({prop:"gpsDevices", fileName:'Dispositivos',value: temp })
                }else{
                    const temp = ()=>(
                        <>
                            <Chip label={currentVehicle['gpsDevices'][0]} color="success" variant="outlined" className="muiChip-device" />
                        </>
                    );
                    data.push({prop:"gpsDevices", fileName:'Dispositivo',value: temp() })
                }
            }
            return(
                <InformationComponent data={data} />
            )
        }else{
            return null;
        }
    }
    const bodyShowFuel=()=>{
        const data=[];
        data.push({prop:"location", fileName:'Localización',value:'Mex-2, General Plutarco Elías Calles, Sonora, Mexico'})
        data.push({prop:"date", fileName:'fecha',value:'13/12/2021 16:01'})
        data.push({prop:"levelFuel", fileName:'Localización',value:'98 Lts. de 500 Lts.'})
        return(
            <FuelVehicleComponent
                data={data}
            />
        )
    }
    const bodyShowLastPosition=()=>{
        const data=[];
        return(
            <FuelVehicleComponent
                data={data}
            />
        )
    }
    const bodyShowTemperature=()=>{
        if(currentVehicle){
            const data=[];
            data.push({prop:"nick", fileName:'Temperatura',value:"88 F"})
            return(
                <div className='app-container'>
                    <div className='temperature-display-container'>
                        <div className='temperature-display hot'>50°C</div>
                    </div>
                </div>
            )
        }else{
            return null;
        }
    }
    const bodyShowTravel=()=>{
        if(currentVehicle){
            const data=[];
            data.push({prop:"Origen", fileName:'Origen',value:'Mex-2, General Plutarco Elías Calles, Sonora, Mexico'})
            data.push({prop:"Destino", fileName:'Destino',value:'Mex-2, General Plutarco Elías Calles, Sonora, Mexico'})
            data.push({prop:"Operador", fileName:'Operador',value:'Juan'})
            data.push({prop:"Remolque 1", fileName:'Remolque 1',value:'Remolque 1'})
            data.push({prop:"Remolque 2", fileName:'Remolque 2',value:'Remolque 2'})
            data.push({prop:"Recorrido", fileName:'Recorrido',value:'Recorrido'})
            data.push({prop:"HoraProgramada", fileName:'Hora Programada',value:'13/12/2021 16:01'})
            data.push({prop:"Horaestimada", fileName:'Hora estimada',value:'13/12/2021 16:01'})
            data.push({prop:"TRetrazado", fileName:'T. Retrazado',value:'2 Hrs.'})
            data.push({prop:"Velocidad", fileName:'Velocidad',value:'55 km/hr'})
            data.push({prop:"Ultimoreporte", fileName:'Último reporte',value:'2 Hrs.'})
            data.push({prop:"Tfueradelinea", fileName:'T. fuera de linea',value:'1 Hr.'})
            return(
                <TravelComponent
                    data={data}
                />
            )
        }else{
            return null;
        }
    }
    const temp =()=>{
        if(type === 1){
            return bodyShowBasicData()
        }else if(type === 2){
            return bodyShowFuel()
        }else if(type === 3){
            return bodyShowLastPosition()
        }else if(type === 4){
            return bodyShowTemperature()
        }else if(type === 5){
            return bodyShowTravel()
        }
    }
    const filterVehicle = () => {
        return vehiclesCard.filter(vehicleCard => vehicleCard.name.search(searchVehicle) !== -1);
    }
    const [currentVehicle,setCurrentVehicle]=useState(undefined);
    const [type,setType]=useState(3)
    const [open,setOpen]=useState(false);
    const [tittleDialog,setTittleDialog] = useState("");
    const [searchVehicle,setSearchVehicle] = useState("");
    return (
        <>
            <FullComponent
                classComponent=''
                Titulo={titleRouts}
                buttonGroupPage={buttonGroupPage}
                //Body={dataBody}
            />
            <FormControl variant="standard" style={{padding:'0 0 0 45px'}} >
                <InputLabel htmlFor="input-with-icon-adornment" style={{padding:'0 0 0 65px'}} >
                    Buscar vehículo
                </InputLabel>
                <Input
                id="input-with-icon-adornment"
                value={searchVehicle}
                onChange={e => setSearchVehicle(e.target.value) }
                startAdornment={
                    <InputAdornment position="start">
                        <FaSearch />
                    </InputAdornment>
                }
                />
            </FormControl>
            {
                <Cards data={filterVehicle()} />
            }
            {
                <ConfirmDIalogComponent
                    open={open}
                    setOpen={setOpen}
                    TituloDialog={tittleDialog}
                    Body={temp}
                    actionFunction={undefined}
                />
            }
        </>
    )
}

const Cards = ({data}) =>{
    let screenWidth = window.innerWidth;
    let maxElementsGrid = 0;
    if(window.innerWidth >= 1280){
        maxElementsGrid=5;
    }else if(window.innerWidth >= 960 && window.innerWidth < 1280){
        maxElementsGrid=3;
    }else if(window.innerWidth >= 600 && window.innerWidth < 960){
        maxElementsGrid=2;
    }
    const newLastElements=data.length % maxElementsGrid;
    return(
        <Grid container spacing={0} justifyContent="space-around" style={{alignItems: "left", padding: '9px 0 0 20px'}}>
            {
                data.map((dat,index) => (
                    <Grid key={`ZonesGet_Cards_Grid_${index}`} item xs={6} sm={4} md={3} lg={2} xl={2}
                        style={
                            screenWidth >= 1280  && screenWidth < 1920 ?(
                                dat === data[data.length - 4] && newLastElements > 3 ?
                                    {position: "relative",right: "2.5%",margin: "5px"}
                                :
                                dat === data[data.length - 3] && newLastElements > 2 ?
                                    newLastElements === 3 ? {position: "relative",right: "6.7%",margin: "5px"} :
                                    {position: "relative",right: "7.5%",margin: "5px"}
                                :
                                dat === data[data.length - 2] && newLastElements > 1 ?
                                newLastElements === 1 ? {position: "relative",right: "2.5%",margin: "5px"} :
                                    newLastElements === 2 ? {position: "relative",right: "15.1%",margin: "5px"} :
                                    newLastElements === 3 ? {position: "relative",right: "20%",margin: "5px"} :
                                    {position: "relative",right: "12.5%",margin: "5px"}
                                :
                                dat === data[data.length - 1] && newLastElements > 0 ?
                                    newLastElements === 1 ? {position: "relative",right: "40%",margin: "5px"} :
                                    newLastElements === 2 ? {position: "relative",right: "45.1%",margin: "5px"} :
                                    newLastElements === 3 ? {position: "relative",right: "33.5%",margin: "5px"} :
                                    {position: "relative",right: "17.5%",margin: "5px"}
                                :
                                {margin: "5px"}
                            )
                            :
                            screenWidth >= 960 && screenWidth < 1280?(
                                dat === data[data.length - 2] && newLastElements > 1 ?
                                    {position: "relative",right: "8.5%",margin: "5px"}
                                :
                                dat === data[data.length - 1] && newLastElements > 0 ?
                                    newLastElements === 1 ? {position: "relative",right: "33.7%",margin: "5px"} :
                                    {position: "relative",right: "25.5%",margin: "5px"}
                                :
                                {margin: "5px"}
                            )
                            :
                            screenWidth >= 600 && screenWidth < 960?(
                                dat === data[data.length - 1] && newLastElements > 0 ?
                                    {position: "relative",right: "25.1%",margin: "5px"}
                                :
                                {margin: "5px"}
                            )
                            :
                            {margin: "5px"}
                        }
                    >
                        <CardUnitsComponent vehicle={dat} name='FV7608' classHeader='unitStatusBlue' />
                    </Grid>
                ))
            }
        </Grid>
    )
}
export default ZonesGet;