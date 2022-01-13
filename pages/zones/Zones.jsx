import CardComponent from "../../Components/CardComponent";
import FullComponent from "../../Components/FullComponent";
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaPlusCircle, FaTrash, FaEye, FaSearch, FaTimes, FaMinus } from 'react-icons/fa';
import * as geolib from 'geolib';
//componentes
import MapComponent from "./MapComponent.jsx";
import { abrirAlertaCampos } from "../../config/alerts";
//
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Button } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ColorPicker, ColorPalette } from '@mui/material/colors';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

//fin componentes
import SubmitFormComponent from "./SubmitFormComponent";
import SubmitFormUpdateComponent from "./SubmitFormUpdateComponent";
import { getUserAction } from "../../store/actions/usuarioActions";
import { getZonesAction, getClassificationsAction, getRegionsAction, createZonesAction, updateZonesAction, deleteZonesAction } from "../../store/actions/zonesActions";
import { getAccountsAction } from "../../store/actions/accountsActions";
import getText from "../../config/languages";
import Link from 'next/link';
const { parse } = require('wkt');
const { stringify } = require('wkt');

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));
const palette = {
    '#000000': '#000000',
    '#009933': '#009933',
    '#00cccc': '#00cccc',
    '#0066cc': '#0066cc',
    '#0000ff': '#0000ff',
    '#660099': '#660099',
    '#ff0000': '#ff0000',
    '#ff6600': '#ff6600',
    '#ffcc00': '#ffcc00',
    '#ffff00': '#ffff00',
};
const Zones = () => {
    //abrirAlertaMap("erro","nada")
    const dispatch = useDispatch();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        const pageName = "";
        const prefixName = "Zonas";
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
                    <Link key={`Zones_Link_${index}`} href={rout.path} >
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
    const Titulo = "Zonas";
    const [flagExternalId,setFlagExternalId] = useState(true);
    const [ initialCenter, setInitialCenter ] = useState(undefined);
    const [ initialZoom, setInitialZoom ] = useState(10);
    const [ centerMap, setCenterMap ] = useState(null)
	const getLocation = React.useCallback(function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		}
	},[])
	function showPosition(position) {
		setInitialCenter({ lat:position.coords.latitude, lng:position.coords.longitude })
	}
    const user = useSelector(state => state.usuario.user);
    const userPermissions = useSelector(state => state.usuario.permissions);
    const userUserType = useSelector(state => state.usuario.userType);
    //permisos
    const createZonePermission = userPermissions.find( per => per.displayName.search("CREATE_ZONES") >=0) || (userUserType === 1)
    const deleteZonePermission = userPermissions.find( per => per.displayName.search("DELETE_ZONES") >=0) || (userUserType === 1)
    const updateZonePermission = userPermissions.find( per => per.displayName.search("UPDATE_ZONES") >=0) || (userUserType === 1)
    const zones = useSelector(state => state.zones.zones);
    const zonesSuccess = useSelector(state => state.zones.success);
    const zonesError = useSelector(state => state.zones.error);
    const classifications = useSelector(state => state.zones.classifications);
    const regions = useSelector(state => state.zones.regions);
    const zoneTypes = useSelector(state => state.zones.zoneTypes);
    const zoneActions = useSelector(state => state.zones.zoneActions);
    const accounts = useSelector(state => state.accounts.accounts);
    const [ proZones, setProZones] = useState([])
    let [ arrayPath, setArrayPath] = useState([])
    const [ createZoneFlag, setCreateZoneFlag ] = useState(false)
    const [ globalAccountId, setGlobalAccountId ] = useState(undefined)
    const [ globalExternalAccountId, setGlobalExternalAccountId ] = useState(undefined)
    const [showHelp,setShowHelp] = useState(false)
    const [showHelpCard,setShowHelpCard] = useState(true)
    const [zoneSelectRoot,setZoneSelectRoot] = useState(true)
    const onSubmitUpdateZoneRoot = async (values) =>{
        const accountFound = accounts.find(account=> account.id === values.account)
        if(accountFound){
            setZoneSelectRoot(false);
            setGlobalAccountId(accountFound.id);
            setGlobalExternalAccountId(accountFound.externalId);
        }
    }
    const validateZoneRoot = (values) => {
        const errors = {};
        //setCreateParentZonesSelect(false)
        if (!values.account) {
            errors.account = 'Requerido';
        }
        return errors;
    }
    useEffect(() => {
        getLocation()
        if (!user) {
            const cargarUsuario = () => dispatch( getUserAction() );
            cargarUsuario()
        }else{
            if(userUserType === 1){
                if(!accounts){
                    const loadAccounts = () => dispatch( getAccountsAction() );
                    loadAccounts()
                }
            }else{
                setGlobalAccountId(user.accountId);
                setGlobalExternalAccountId(user.externalAccountId);
            }
        }
        setArrayPath([])
    },[accounts, getLocation, user, userUserType])
    useEffect(() => {
        if(globalAccountId && globalAccountId !== null){
            setFlagExternalId(true)
            if (user) {
                const loadZones = () => dispatch( getZonesAction(globalAccountId) );
                loadZones()
                const loadClassifications = () => dispatch( getClassificationsAction(globalAccountId) );
                loadClassifications()
                const loadRegions = () => dispatch( getRegionsAction(globalAccountId) );
                loadRegions()
            }
        }else{
            setFlagExternalId(false)
        }
    },[dispatch, globalAccountId, globalExternalAccountId, user])
    useEffect(() => {
        if(zones && classifications && regions){
            const tempZonePro = classifications.map( classification => {
                const zonefound = zones.find(zone => zone.id === classification.zoneId)
                if(zonefound){
                    classification.zone = zonefound;
                }
                const regionfound = regions.find(region => region.id === classification.region)
                if (regionfound) {
                    classification.regionName = regionfound.name;
                }
                return classification;
            })
            setProZones(tempZonePro)
            if (!zonesSuccess || !zonesError) {
                setCreateZoneFlag(false)
            }
            if(zonesSuccess){
                setArrayPath(arrayPath.map(path => {
                    path.editable=false;
                    return path;
                }))
            }
        }else{
            if(!zones || !classifications){
                setArrayPath([])
                setCardZone([])
            }
        }
        setUpdateZoneFlag(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[zones, classifications, regions, zonesSuccess, zonesError])
    function createData(name, calories) {
        return { name, calories };
    }
    const [ cardZone, setCardZone ] = useState([])
    useEffect(() => {
        if(proZones.length > 0 ){
            const data = proZones.map(zon => {
                const region = zon.regionName;
                const name = zon.zone.name;
                const id = zon.id;
                const color = zon.color;
                const expanded = false;
                const polygonWKT = zon.zone.polygonWKT;
                const zonType = zoneTypes.find(type => type.id === zon.type)
                const zonActions = zoneActions.find(action => action.id === zon.action)
                const rows = [
                    //createData('Alias', zon.alias),
                    createData('Descripción', zon.description),
                    createData('Región', zon.regionName),
                    createData('Tipo', zonType ? zonType.name : zon.type),
                    createData('Accion', zonActions ? zonActions.name : zon.action),
                ];
                if(zon.parent && zon.parent !== '00000000-0000-0000-0000-000000000000'){
                    const classificationFound = classifications.find(cla => cla.id === zon.parent)
                    rows.push(createData('Zona padre', classificationFound ? classificationFound.alias : zon.parent))
                }
                return {name,rows,polygonWKT,id,expanded,color,region}
            })
            setCardZone(data)
            //setArrayPath(zonesPath)
        }else{
            if(!classifications || classifications.length <= 0){
                setArrayPath([])
                setCardZone([])
            }
        }
    },[proZones, zoneTypes, zoneActions, classifications])
    /**
     * *handleSeeZone
     * *Nos muestra la zona dibujada en el mapa
     * @e evento
     * @zone zona que se mostrara en el mapa
     */
    const handleSeeZone = (zone) => {
        //e.preventDefault()
        if(!arrayPath || !arrayPath.find(path => path.id === zone.id )) {
            const pathParse = parse(zone.polygonWKT);
            const formatPath = pathParse.coordinates[0].map(coor => {
                return { lat:coor[1],lng:coor[0] }
            })
            formatPath.pop();
            //funcion
            getCenterAndZoomPath(formatPath,pathParse)
            if (arrayPath) {
                setArrayPath(
                    [
                        ...arrayPath,
                        {
                            path:formatPath,
                            id:zone.id,
                            color:zone.color,
                            name:zone.name
                        }
                    ])
            }else{
                setArrayPath(
                    [
                        {
                            path:formatPath,
                            id:zone.id,
                            color:zone.color,
                            name:zone.name
                        }
                    ])
            }
        }else{
            if (arrayPath) {
                const a = (arrayPath.filter(path => path.id !== zone.id))
                setArrayPath(a)
            }
        }
    }
    /**
     * *getCenterAndZoomPath
     * *Nos muestra la zona dibujada en el mapa
     * @formatPath coordenadas en arreglo JSON para que lo lea la libreria geolib
     * @pathParse coordenadas parseadas a un arreglo
     */
    const getCenterAndZoomPath = (formatPath,pathParse) => {
        //center
        const centerNew = geolib.getCenter(formatPath);
        setInitialCenter({ lat:centerNew.latitude,lng:centerNew.longitude})
        //zoom
        const boun = geolib.getBounds(pathParse.coordinates[0]);
        const distan = geolib.getDistance(
            {
                latitude:boun.maxLat,
                longitude:boun.maxLng,
            },{
                latitude:boun.minLat,
                longitude:boun.minLng,
            }
        );
        let tempo = 30;
        let zoomtempo = 22;
        for (let i = 22; i > 0; i--) {
            tempo = tempo * 2;
            if(tempo > distan){
                zoomtempo = i-1;
                break;
            }
        }
        setInitialZoom(zoomtempo)
    }
    const handleExpandClick = (e,zone) => {
        e.preventDefault()
        const data = cardZone.map(zon => {
            if(zon.id === zone.id){
                zon.expanded = !zon.expanded;
            }
            return zon;
        })
        setCardZone(data)
        //setExpanded(!expanded);
    };

    const addZone = () => {
        setRegionZone("")
        setShowHelp(true)
        setCreateZoneFlag(true);
        setInitialCenter(centerMap)
        if(arrayPath.length > 0){
            const newPath=[
            ]
            setArrayPath(
                [
                    ...arrayPath,
                    {id:"new001",path:newPath,editable:true},
            ])
        }else{
            const newPath=[
            ]
            //setInitialZoom(15)
            setArrayPath([{id:"new001",path:newPath,editable:true}])
        }
    }
    const closeCreateZone = () =>{
        setShowHelp(false)
        setCreateZoneFlag(false)
        setUpdateZoneFlag(false)
        setArrayPath([])
        setColor('#000')
        setRegionZone(undefined)
        setDisplayErrorRegion('none')
    }
    const [color,setColor] = useState('#000')
    const handleChangeColor = (e) => {
        //e.preventDefault()
        const curretnColor = e;
        setColor(curretnColor)
        const temp = arrayPath.map(path => {
            if(path.id === "new001"){
                path.color = curretnColor;
            }
            if(path.editable){
                path.color = curretnColor;
            }
            return path;
        })
        setArrayPath(
            temp
        )
    }
    const [ createParentZonesSelect, setCreateParentZonesSelect] = useState(false);
    /**
     * *childInParentZone
     * *armado de objeto y envio de accion para crear zona
     * @childZone array path de hijo
     * @parentZone array path de padre
     */
    const childInParentZone = (childZone,parentZone) => {
        let flagError = false;
        childZone.forEach(coo => {
            const flagIn = geolib.isPointInPolygon(
                coo,
                parentZone
            );
            if(!flagIn)
                flagError=true
        });
        return flagError;
    }
    /**
     * *onSubmit
     * *armado de objeto y envio de accion para crear zona
     * @values valores del formulario
     */
    const onSubmit = async (values) => {
        const newPath=arrayPath.find(path => path.id === "new001");
        const temp = newPath.path.map(path => ([path.lng,path.lat]))
        if(temp.length >= 3){
            if(regionZone){
                if (newPath) {
                    //const temp = newPath.path.map(path => ([path.lng,path.lat]))
                    temp.push(
                        temp[0]
                    )
                    const polygon = {
                        type:'Polygon',
                        coordinates:[temp]
                    }
                    const polygonString =stringify(polygon)
                    const newProZone = {
                        pafAccountId: globalAccountId,
                        externalAccountId: globalExternalAccountId,
                        name: values.classificationName,
                        wktPolygon: polygonString,
                        alias: values.classificationName,
                        description: values.description,
                        type: values.type,
                        action: values.action,
                        region: regionZone.id,
                        color: color,
                    }
                    if(values.parentZone && values.type !== 1 && values.type !== 2 ){
                        newProZone.parent = values.parentZone;
                    }
                    if(!regionZone.id){
                        newProZone.newRegion = true;
                        newProZone.newRegionName = regionZone.name;
                    }
                    if (newProZone.parent) {
                        const parentZoneFound = proZones.find(pz => pz.id === newProZone.parent)
                        const pathParse = parse(parentZoneFound.zone.polygonWKT);
                        const formatPath = pathParse.coordinates[0].map(coor => {
                            return { lat:coor[1],lng:coor[0] }
                        })
                        formatPath.pop();
                        const arrayPathC = arrayPath.find(pz => pz.id === "new001")
                        //hijo,padre
                        const flagError = childInParentZone(arrayPathC.path,formatPath)
                        if(flagError){
                            abrirAlertaCampos('error','La zona no se encuentra dentro de su zona padre')
                        }else{
                            dispatch(createZonesAction(newProZone))
                            setArrayPath([])
                        }
                    }
                    if(!newProZone.parent){
                        dispatch(createZonesAction(newProZone))
                        setArrayPath([])
                    }
                }
            }else{
                abrirAlertaCampos("warning","La región no es valida")
            }
        }else{
            abrirAlertaCampos("warning","La forma del poligono no es valida")
        }
    };
    /**
     * *validate
     * *validador de formulario
     * @values valores del formulario
     */
    const validate = (values) => {
        const errors = {};
        console.log("values")
        console.log(values)
        //setCreateParentZonesSelect(false)
        if (!values.classificationName) {
            errors.classificationName = 'Requerido';
        }
        if (!values.type) {
            errors.type = 'Requerido';
        }else{
            const globalZ = zoneTypes.find( ty => ty.id === values.type)
            if(!values.parentZone){
                if(!globalZ.parent){
                    errors.parentZone = 'Requerido';
                    setCreateParentZonesSelect(true)
                }
            }else{
                const parentZoneC = filterZones(cardZone).find(pz => pz.id === values.parentZone)
                if(parentZoneC && arrayPath && !arrayPath.find(path => path.id === parentZoneC.id )) {
                    const pathParse = parse(parentZoneC.polygonWKT);
                    const formatPath = pathParse.coordinates[0].map(coor => {
                        return { lat:coor[1],lng:coor[0] }
                    })
                    formatPath.pop();
                    //funcion
                    getCenterAndZoomPath(formatPath,pathParse)
                    setArrayPath(
                        [
                            ...arrayPath,
                            {
                                path:formatPath,
                                id:parentZoneC.id,
                                color:parentZoneC.color,
                                name:parentZoneC.name
                            }
                        ]
                    )
                }
                //handleSeeZoneTempo(parentZoneC)
            }
            if(globalZ.parent){
                setCreateParentZonesSelect(false)
            }
        }
        if (!values.action) {
            if(values.action !== 0){
                errors.action = 'Requerido'; 
            }
        }
        if(!regionZone && regionRef.current) {
            regionRef.current.classList.add('MuiInput-underline');
            regionRef.current.classList.add('Mui-error');
            regionRef.current.classList.add('autocompleteError');
            setDisplayErrorRegion('initial')
        }
        return errors;
    };
    /**
     * *handleChangeTypeInput
     * *capta el cambio en select 'tipo de zona' para ocultar o mostrar select ('zona padre')
     * @e evento
     */
    const handleChangeTypeInput = (e) => {
        e.preventDefault()
        const globalZ = zoneTypes.find( ty => ty.id === e.target.value)
        if(globalZ){
            if(!globalZ.parent ){
                setCreateParentZonesSelect(true)
            }else{
                setCreateParentZonesSelect(false)
            }
        }
    }
    const handleEditZone = (id,newPath) => {
        setArrayPath(
            arrayPath.map(currentPath => {
                if (currentPath.id === id) {
                    currentPath.path = newPath;
                }
                return currentPath;
            })
        )
    }
    const [ searchZone, setSearchZone ] = useState("");
    /**
     * *filterZones
     * *Filtrar zonas por busqueda de nombre
     */
    const filterZones = (zonesToFilter) =>{
        return zonesToFilter.filter(zon => zon.name.search(searchZone) !== -1)
    }
    const filter = createFilterOptions();
    const [regionZone, setRegionZone] = useState(null);
    const [displayErrorRegion,setDisplayErrorRegion] = useState('none');
    const regionRef = useRef(undefined);

    const [updateZoneFlag,setUpdateZoneFlag] = useState(false)
    const [initialValues,setInitialValues ] = useState(undefined);
    const tempRef = useRef(undefined);
    /**
     * *handleUpdateZone
     * *Crear componente de formulario para editar zona
     * @e evento
     * @zone zona que se esta editando
     */
    const handleUpdateZone = (e,zone) => {
        e.preventDefault();
        setShowHelp(true)
        const currentProZone = proZones.find(zon => zon.id === zone.id);
        setRegionZone(currentProZone.regionName)
        setColor(currentProZone.color)
        setUpdateZoneFlag(true);
        setInitialValues({
            zoneName:currentProZone.zone.name,
            classificationName:currentProZone.alias,
            description:currentProZone.description,
            type:currentProZone.type,
            parentZone:currentProZone.parent,
            action:currentProZone.action,
            region:currentProZone.region,
            zoneId:currentProZone.zone.id,
            classificationId: currentProZone.id,
        })
        const pathParse = parse(currentProZone.zone.polygonWKT);
        const formatPath = pathParse.coordinates[0].map(coor => {
            return { lat:coor[1],lng:coor[0]}
        })
        formatPath.pop();
        getCenterAndZoomPath(formatPath,pathParse)
        setArrayPath(
        [
            {
                path:formatPath,
                id:currentProZone.zone.id,
                color:currentProZone.color,
                name:currentProZone.zone.name,
                editable:true
            }
        ])
    }
    /**
     * *onSubmitUpdate
     * *armado de objeto y envio de accion para editar zona
     * @values valores del formulario
     */
    const onSubmitUpdate = async (values) => {
        console.log(values)
        const currentPath = arrayPath.find(path => path.id === values.zoneId)
        const currentProZone = proZones.find(zon => zon.id === values.classificationId)
        const temp = currentPath.path.map(path => ([path.lng,path.lat]))
        temp.push(
            temp[0]
        )
        const polygon = {
            type:'Polygon',
            coordinates:[temp]
        }
        const polygonString =stringify(polygon)
        const newProZone = {
            pafAccountId: globalAccountId,
            externalAccountId: globalExternalAccountId,
            name: values.zoneName,
            wktPolygon: polygonString,
            alias: values.zoneName,
            description: values.description,
            type: values.type,
            action: values.action,
            region: regionZone.id,
            color: color,
            zoneId:values.zoneId,
            classificationId: values.classificationId,
        }
        const globalType = zoneTypes.find( ty => ty.id === values.type)
        if(values.parentZone && !globalType.parent ){
            newProZone.parent= values.parentZone;
        }
        if (
                newProZone.name !== currentProZone.zone.name ||
                newProZone.wktPolygon !== currentProZone.zone.polygonWKT ||
                newProZone.alias !== currentProZone.alias ||
                newProZone.description !== currentProZone.description ||
                newProZone.type !== currentProZone.type ||
                newProZone.action !== currentProZone.action ||
                newProZone.region !== currentProZone.region ||
                newProZone.color !== currentProZone.color ||
                newProZone.parent !== currentProZone.parent
            ) {
                if (newProZone.parent) {
                    const parentZoneFound = proZones.find(pz => pz.id === newProZone.parent)
                    const pathParse = parse(parentZoneFound.zone.polygonWKT);
                    const formatPath = pathParse.coordinates[0].map(coor => {
                        return { lat:coor[1],lng:coor[0] }
                    })
                    formatPath.pop();
                    const arrayPathC = arrayPath.find(pz => pz.id === values.zoneId)
                    //hijo,padre
                    const flagError = childInParentZone(arrayPathC.path,formatPath)
                    if(flagError){
                        abrirAlertaCampos('error','La zona no se encuentra dentro de su zona padre')
                    }else{
                        dispatch(updateZonesAction(newProZone))
                        setArrayPath([])
                    }
                }else{
                    dispatch(updateZonesAction(newProZone))
                }
        }else{
            abrirAlertaCampos("error","No se encontraron cambios");
        }
    };
    const buttonGroupPageFullComponent = []
    if (createZoneFlag || updateZoneFlag) {
        buttonGroupPageFullComponent.push({
            funcion : () => {setArrayPath(arrayPath.map(path => {if(path.editable){path.path=[]}return path;}))},
            nombre : "Limpiar mapa",
            icono : null,
            clase : "defaultButton"
        },{
            funcion : closeCreateZone,
            nombre : "Cancelar",
            icono : null,
            clase : "neutroButton"
        })
    }else{
        if(userUserType === 1){
            buttonGroupPageFullComponent.push({
                funcion : () => {
                    setZoneSelectRoot(true);
                    setProZones([]);
                    setArrayPath([]);
                    setCardZone([]);
                    setGlobalAccountId(undefined);
                    setGlobalExternalAccountId(undefined);
                },
                nombre : "Seleccionar cuenta",
                icono : null,
                clase : "neutroButton"
            })
        }
        buttonGroupPageFullComponent.push({
            funcion : () => {setArrayPath([])},
            nombre : "Limpiar mapa",
            icono : null,
            clase : "defaultButton"
        })
        if(createZonePermission){
            buttonGroupPageFullComponent.push({
                funcion : addZone,
                nombre : "Crear zona",
                icono : <FaPlusCircle style={{margin: "0 10px 0 0"}} />,
                clase : "successButton"
            })
        }
    }
    /**
     * *handleDeleteZone
     * *se envia accion para eliminar zona
     * @e evento
     * @zone zona que se esta elimiando
     */
    const handleDeleteZone = (e,zone) => {
        e.preventDefault();
        const currentZone = proZones.find(zon => zon.id === zone.id)
        if(currentZone){
            const dataDelete = {zoneId:currentZone.zone.id,classificationId:currentZone.id}
            dispatch(deleteZonesAction(dataDelete))
            setArrayPath([])
        }
    }
    return (
        <>
        {
                userUserType === 1 && zoneSelectRoot ?
                <Card sx={{ maxWidth: 350, minWidth: 100 }} style={{position: "relative",top:"200px",left:"50%",transform:"translate(-50%,-50%)"}}>
                    <CardHeader
                        style={{padding: "5px", background:"#1269b3",color:"#FFF",textAlign:"-webkit-center"}}
                        title="Seleccione su cuenta"
                        titleTypographyProps={{fontSize:"20px"}}
                    />
                    <CardContent>
                        <Grid item xs={12} style={{paddingLeft: "32px"}}>
                            <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
                                {
                                    <Form
                                        onSubmit={onSubmitUpdateZoneRoot}
                                        initialValues={initialValues}
                                        validate={validateZoneRoot}
                                        render={({ handleSubmit, reset, submitting, pristine, values }) => (
                                        <form onSubmit={handleSubmit} noValidate>
                                            <Paper style={{ padding: 16 }}>
                                            <Grid container alignItems="flex-start" spacing={2}>
                                                <Grid item xs={12}>
                                                    <Field
                                                            fullWidth
                                                            required
                                                            name="account"
                                                            label="Cuentas"
                                                        >
                                                        {props => (
                                                            <>
                                                                <InputLabel className={props.meta.error && props.meta.touched ? "textError":""} >Cuentas</InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    name="account"
                                                                    label="Cuentas"
                                                                    onClick={ handleChangeTypeInput }
                                                                    variant="standard"
                                                                    {...props.input}
                                                                >
                                                                    {
                                                                        accounts ? accounts.map((account,key) => (
                                                                            <MenuItem style={{display: "list-item"}} key={account.id} value={account.id}>{account.name}</MenuItem>
                                                                        ))
                                                                        :
                                                                        []
                                                                    }
                                                                </Select>
                                                                {
                                                                    props.meta.error && props.meta.touched &&
                                                                    <p className="regionZoneError" >{props.meta.error}</p>
                                                                }
                                                            </>
                                                        )}
                                                    </Field>
                                                </Grid>
                                                <Grid item style={{ marginTop: 16 }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        type="submit"
                                                        disabled={submitting}
                                                    >
                                                        Ver zonas
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            </Paper>
                                        </form>
                                        )}
                                    />
                                }
                            </div>
                        </Grid>
                    </CardContent>
                </Card>
                :
                    flagExternalId ?
                        <>
                            <FullComponent
                                Titulo={titleRouts}
                                buttonGroupPage={buttonGroupPageFullComponent}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid container spacing={0} >
                                    {
                                        createZoneFlag ?
                                            <Grid item xs={3} style={{paddingLeft: "10px"}}>
                                                <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
                                                    <SubmitFormComponent
                                                        onSubmit={onSubmit}
                                                        //validate={validate}
                                                        //fields={createForm()}
                                                        regions={regions}
                                                        regionZone={regionZone}
                                                        setRegionZone={setRegionZone}
                                                        zoneTypes={zoneTypes}
                                                        handleChangeTypeInput={handleChangeTypeInput}
                                                        proZones={proZones}
                                                        zoneActions={zoneActions}
                                                        handleChangeColor={handleChangeColor}
                                                        cardZone={cardZone}
                                                        searchZone={searchZone}
                                                        arrayPath={arrayPath}
                                                        setArrayPath={setArrayPath}
                                                        getCenterAndZoomPath={getCenterAndZoomPath}
                                                        color={color}
                                                    />
                                                </div>
                                            </Grid>
                                        :
                                            updateZoneFlag ?
                                                <Grid item xs={3} style={{paddingLeft: "10px"}}>
                                                    <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
                                                        <SubmitFormUpdateComponent
                                                            onSubmit={onSubmitUpdate}
                                                            //validate={validate}
                                                            //fields={createForm()}
                                                            regions={regions}
                                                            regionZone={regionZone}
                                                            setRegionZone={setRegionZone}
                                                            zoneTypes={zoneTypes}
                                                            handleChangeTypeInput={handleChangeTypeInput}
                                                            proZones={proZones}
                                                            zoneActions={zoneActions}
                                                            handleChangeColor={handleChangeColor}
                                                            cardZone={cardZone}
                                                            searchZone={searchZone}
                                                            arrayPath={arrayPath}
                                                            setArrayPath={setArrayPath}
                                                            getCenterAndZoomPath={getCenterAndZoomPath}
                                                            color={color}
                                                            initialValues={initialValues}
                                                        />
                                                    </div>
                                                </Grid>
                                            :
                                                <Grid item xs={3} style={{paddingLeft: "10px"}}>
                                                    <FormControl variant="standard" style={{width:'100%',paddingBottom:'15px'}}>
                                                        <InputLabel htmlFor="input-with-icon-adornment">
                                                            Buscar zona
                                                        </InputLabel>
                                                        <Input
                                                        id="input-with-icon-adornment"
                                                        value={searchZone}
                                                        onChange={e => setSearchZone(e.target.value) }
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <FaSearch />
                                                            </InputAdornment>
                                                        }
                                                        />
                                                    </FormControl>
                                                    <div className="infoGrid"  >
                                                    {
                                                        filterZones(cardZone).map((zone,key) =>(
                                                            <Card sx={{ minWidth: 220 }} style={{margin: "0 0 12px 0"}} key={key}>
                                                                <CardContent style={{padding:'0 0 0 12px'}}>
                                                                    <Typography variant="h7" component="div" onClick={ e => handleExpandClick(e,zone) }>
                                                                        <b>{zone.name}</b>
                                                                        <ExpandMore
                                                                            expand={zone.expanded}
                                                                            aria-expanded={zone.expanded}
                                                                            aria-label="show more"
                                                                            style={{float:'right',backgroundColor:"transparent",color:"#000"}}
                                                                        >
                                                                            <ExpandMoreIcon />
                                                                        </ExpandMore>
                                                                    </Typography>
                                                                </CardContent>
                                                                <Collapse in={zone.expanded} timeout="auto" unmountOnExit>
                                                                    <CardContent style={{padding:'0 0 0 16px'}}>
                                                                        <TableContainer component={Paper} style={{boxShadow: "none"}}>
                                                                            <Table sx={{  }} aria-label="simple table">
                                                                                <TableBody>
                                                                                {zone.rows.map((row) => (
                                                                                    <TableRow
                                                                                        key={row.name}
                                                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                                    >
                                                                                        <TableCell style={{border:'0px', padding: "0 15px 1px 0"}} component="th" scope="row"> {row.name} </TableCell>
                                                                                        <TableCell style={{border:'0px', padding: "0 15px 1px 0"}} align="left">{row.calories}</TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                        <div style={{display:'block',textAlignLast:"center"}} className='buttonCard'>
                                                                            {
                                                                                deleteZonePermission ?
                                                                                    <Button className="errorButton" style={{minWidth: "50px"}} onClick={e => handleDeleteZone(e,zone) } >
                                                                                        <FaTrash size={15} className='fa-lg' ></FaTrash>
                                                                                    </Button>
                                                                                :
                                                                                    null
                                                                            }
                                                                            {
                                                                                updateZonePermission ?
                                                                                    <Button className="defaultButton" style={{minWidth: "50px"}} onClick={e => handleUpdateZone(e,zone) } >
                                                                                        <FaEdit size={15} className='fa-lg' ></FaEdit>
                                                                                    </Button>
                                                                                :
                                                                                    null
                                                                            }
                                                                            <Button className="successButton" style={{minWidth: "50px"}} onClick={e => handleSeeZone(zone) } >
                                                                                <FaEye size={15} className='fa-lg' ></FaEye>
                                                                            </Button>
                                                                        </div>
                                                                    </CardContent>
                                                                </Collapse>
                                                            </Card>
                                                        ))
                                                    }
                                                    </div>
                                                </Grid>
                                    }
                                    <Grid item xs={9}>
                                        {
                                            <CardComponent
                                                key='MapZone'
                                                Body={MapComponent}
                                                classBody="mapComponent"
                                                classComponent="mapDiv"
                                                arrayPath={arrayPath}
                                                setArrayPath={setArrayPath}
                                                handleEditZone={handleEditZone}
                                                initialCenter={initialCenter}
                                                initialZoom={initialZoom}
                                                setInitialCenter={setInitialCenter}
                                                setCenterMap={setCenterMap}
                                                centerMap={centerMap}
                                            />
                                        }
                                        {
                                            showHelp ?
                                            <Card sx={{ maxWidth: 350, minWidth: 100 }} className="cardHelp"  id="ayuda">
                                                <CardHeader
                                                    className='cardHeader'
                                                    action={
                                                        <>
                                                        <IconButton aria-label="settings" onClick={()=>{setShowHelpCard(!showHelpCard)}}>
                                                            <FaMinus style={{fontSize: '11px',marginRight:'10px'}} />
                                                        </IconButton>
                                                        <IconButton aria-label="settings" onClick={()=>{setShowHelp(false)}} >
                                                            <FaTimes style={{fontSize: '11px'}} />
                                                        </IconButton>
                                                        </>
                                                    }
                                                    title="Ayuda"
                                                    titleTypographyProps={{fontSize:"12px"}}
                                                    component="span"
                                                />
                                                {
                                                    showHelpCard ?
                                                        <CardContent sx={{ flex: '1 0 auto' }} style={{padding: "5px 5px"}}>
                                                            <Typography component="div">
                                                            <div style={{fontSize: '11px'}}>
                                                                <p style={{padding: "0",lineHeight: "11px"}}><b>Nuevo punto:</b>haga doble clic en el mapa.</p>
                                                                <p style={{padding: "0",lineHeight: "11px"}}><b>Insertar un punto:</b>mueva los puntos sombreados a la mitad de la linea.</p>
                                                                <p style={{padding: "0",lineHeight: "11px"}}><b>Eliminar punto:</b>haga doble clic en un punto.</p>
                                                                <p style={{padding: "0",lineHeight: "11px"}}><b>Mover un punto:</b>haga clic en un punto y, apretando el botón izquierdo del ratón, arrástrelo a otro lugar.</p>
                                                            </div>
                                                            </Typography>
                                                        </CardContent>
                                                    :
                                                        null
                                                }
                                            </Card>
                                            :null
                                        }
                                    </Grid>
                                </Grid>
                            </Box>
                        </>
                    :
                        <div className="notification" style={{width: "100%"}}>
                            <div className="divStaticMessage">
                            </div>
                            <div className="divDinamicMessage">
                                <h1>No tiene cuenta de GPS relacionada</h1>
                            </div>
                        </div>
        }
        </>
    );
}

export default Zones;
