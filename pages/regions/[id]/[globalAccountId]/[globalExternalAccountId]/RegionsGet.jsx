import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import CardRegionsComponent from "./CardRegionsComponent";
import FullComponent from "../../../../../Components/FullComponent"
import { getRegionsAction, getClassificationsAction} from "../../../../../store/actions/zonesActions";
import { getRulesAction } from "../../../../../store/actions/rulesActions";
import Grid from "@material-ui/core/Grid";
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import { FaSearch } from 'react-icons/fa';
//import '../style/regions.scss'
import getText from "../../../../../config/languages";
import { useRouter } from 'next/router';
import Link from 'next/link';
const RegionsGet = ({...pageProps}) => {
    const dispatch = useDispatch()
    const router = useRouter();
    const { id } =  pageProps.router.query
    const { globalAccountId } =  pageProps.router.query
    const { globalExternalAccountId }=  pageProps.router.query
    const regions = useSelector(state => state.zones.regions);
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        if(regions){
            const regionFound = regions.find(region => region.id === id);
            if(regionFound){
                setTitle(regionFound.name)
                const pathname = window.location.pathname;
                const pageName = regionFound.name;
                const prefixName = "Region";
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
                        <Link key={`RegionsGet_Link_${index}`} href={rout.path} >
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
    }, [id, regions])
    const [title,setTitle] = useState("")
    const classifications = useSelector(state => state.zones.classifications);
    const rules = useSelector(state => state.rules.rules);
    const [dataBody,setDataBody]=useState(null)
    useEffect(() => {
        if(!regions){
            const loadRegions = () => dispatch( getRegionsAction(globalAccountId) );
            loadRegions();
        }
        if(!classifications){
            const loadClassifications = () => dispatch( getClassificationsAction(globalAccountId) );
            loadClassifications();
        }
        if(!rules){
            const loadRules = () => dispatch( getRulesAction(globalAccountId) );
            loadRules();
        }
    }, [dispatch, globalAccountId])
    useEffect(() => {
        if(regions){
            const regionFound = regions.find(region => region.id === id);
            if(regionFound){
                setTitle(regionFound.name)
            }
        }
    }, [id, regions])
    const [zonesCard,setZonesCard]=useState([])
    useEffect(() => {
        if(regions && classifications && rules ){
            const temp = classifications.filter(classification => classification.region === id )
            console.log(temp)
            const arrayCard = [];
            rules.forEach(rule => {
                const classificationFound = classifications.find(classification => classification.id === rule.geofenceId && classification.region === id )
                if(classificationFound){
                    console.log(classificationFound)
                    const currentZoneRule = {
                        id : classificationFound.id,
                        alias : classificationFound.alias,
                        ruleId : rule.id,
                        maxUnits : rule.maxUnits,
                        timeBeforePit : rule.timeBeforePit,
                        timeInPit : rule.timeInPit,
                        timeAfterPit : rule.timeAfterPit,
                        maxUnitsCurrent : Math.floor(Math.random() * 10),
                        timeBeforePitCurrent : Math.floor(Math.random() * 10),
                        timeInPitCurrent : Math.floor(Math.random() * 10),
                        timeAfterPitCurrent : Math.floor(Math.random() * 10),
                    }
                    arrayCard.push(currentZoneRule);
                }
            });
            console.log(arrayCard)
            setZonesCard(arrayCard)
        }
    }, [regions, classifications, id, globalAccountId, globalExternalAccountId, rules])
    const buttonGroupPage = [{
        funcion : ()=>{router.push(`/regions`);},
        nombre : "Regresar",
        icono : null,
        clase : "neutroButton"
    }]
    const filterZones = () => {
        console.log(zonesCard)
        return zonesCard.filter(zoneCard => zoneCard.alias.search(searchZone) !== -1)
    }
    const [searchZone,setSearchZone] = useState("");
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
            {
                //dataBody
                <Cards data={filterZones()} globalAccountId={globalAccountId} globalExternalAccountId={globalExternalAccountId} />
            }
        </>
    )
}

const Cards = ({data,globalAccountId,globalExternalAccountId}) =>{
    const router = useRouter();
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
                    <Grid key={`RegionsGet_Cards_Grid_${index}`} item xs={6} sm={4} md={3} lg={2} xl={2}
                        style={
                            screenWidth >= 1280 ?(
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
                        <CardRegionsComponent zoneRule={dat} handleSeeZone={()=>{router.push(`/zones/${dat.id}/${globalAccountId}/${globalExternalAccountId}`)}} />
                    </Grid>
                ))
            }
        </Grid>
    )
}
export default RegionsGet;