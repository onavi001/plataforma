import React, {useEffect,useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
//import { Route, Redirect } from 'react-router-dom';
import Card from '@mui/material/Card';
import preloader from "../public/img/preloader.svg";
import { useRouter } from 'next/router'
import { abrirAlertaCampos } from "../config/alerts";
import { getUserActionLocalStorage, refreshTokenAction, logoutAction } from "../store/actions/usuarioActions";
import { changeState } from "../store/actions/accountsActions";
import { changeStateVehicle } from "../store/actions/unidadesActions";
import { changeStateDevices } from "../store/actions/devicesActions";
import { changeStateUser } from "../store/actions/usuarioActions";
import { changeStateZones } from "../store/actions/zonesActions";
import { changeStateRules } from "../store/actions/rulesActions";
import { fileMesagge } from "../config/message";
import Image from 'next/image'
const ticksToDate = require('ticks-to-date');
const PrivateRoute = ({ Component, ...pageProps}) => {
    const dispatch = useDispatch();
    const router = useRouter()
    const login = useSelector(state => state.usuario.login);
    //new action reducer to add user data from localstorage
    const [localStorage_login,setlocalStorage_login] = useState(undefined)//sessionStorage.getItem('loggedIn')
    const [localStorage_expiration,setlocalStorage_expiration] = useState(undefined)//sessionStorage.getItem('expiration')
    const [localStorage_user,setlocalStorage_user] = useState(undefined)
    const [dateTicks,setdateTicks] = useState(undefined)
    const [pathname,setpathname] = useState(undefined);
    useEffect(() => {
        setlocalStorage_login(sessionStorage.getItem('loggedIn'))
        setlocalStorage_expiration(sessionStorage.getItem('expiration'))
        setlocalStorage_user(JSON.parse(sessionStorage.getItem('user')))
        setdateTicks(parseInt(sessionStorage.getItem('expiration')));
        setpathname(window.location.pathname)
    }, [])
    if (localStorage_user) {
        let permissionsTemp = localStorage_user.permissions;
        let services = localStorage_user.services;
        localStorage_user.roles.forEach(rol => {
            permissionsTemp = permissionsTemp.concat(rol.permisesOfRole)
        });
        const permissions = [];
        permissionsTemp.forEach((item)=>{
            console.log(permissionsTemp)
            if(!permissions.find(res => res.displayName === item.displayName)){
                permissions.push(item);
            }
        })
        dispatch(getUserActionLocalStorage(localStorage_user,permissions,services))
    }
    /**
     * ticks
     */
    //REGLAS
    //#region loading
    const rulesLoading = useSelector(state => state.rules.loading);
    const rulesSuccess = useSelector(state => state.rules.success);
    const rulesSuccessMessage = useSelector(state => state.rules.successMessage);
    const rulesError = useSelector(state => state.rules.error);
    const rulesErrorMessage = useSelector(state => state.rules.errorMessage);
    //const userPermissions = useSelector(state => state.usuario.permissions);
    //const user = useSelector(state => state.usuario.user);
    useEffect(() => {
        if (rulesSuccess) {
            abrirAlertaCampos("success",rulesSuccessMessage);
            dispatch(changeStateRules())
        }
        if (rulesError) {
            const message = fileMesagge('',rulesErrorMessage)
            abrirAlertaCampos("error",message);
            dispatch(changeStateRules())
        }
    }, [rulesSuccess, rulesError, rulesSuccessMessage, dispatch, rulesErrorMessage])
    //zonas
    const zonesLoading = useSelector(state => state.zones.loading);
    const zonesSuccess = useSelector(state => state.zones.success);
    const zonesSuccessMessage = useSelector(state => state.zones.successMessage);
    const zonesError = useSelector(state => state.zones.error);
    const zonesErrorMessage = useSelector(state => state.zones.errorMessage);
    useEffect(() => {
        if (zonesSuccess) {
            abrirAlertaCampos("success",zonesSuccessMessage);
            dispatch(changeStateZones())
        }
        if (zonesError) {
            abrirAlertaCampos("error",zonesErrorMessage);
            dispatch(changeStateZones())
        }
    }, [zonesSuccess, zonesError, zonesSuccessMessage, dispatch, zonesErrorMessage])
    //const user = useSelector(state => state.usuario.user);
    const usuarioLoading = useSelector(state => state.usuario.loading);
    const usuarioSuccess = useSelector(state => state.usuario.success);
    const usuarioSuccessMessage = useSelector(state => state.usuario.successMessage);
    const usuarioError = useSelector(state => state.usuario.error);
    const usuarioErrorMessage = useSelector(state => state.usuario.errorMessage);
    //const userPermissions = useSelector(state => state.usuario.permissions);
    //const user = useSelector(state => state.usuario.user);
    useEffect(() => {
        if (usuarioSuccess) {
            abrirAlertaCampos("success",usuarioSuccessMessage);
            dispatch(changeStateUser())
        }
        if (usuarioError) {
            const message = fileMesagge('',usuarioErrorMessage)
            abrirAlertaCampos("error",message);
            dispatch(changeStateUser())
        }
    }, [usuarioSuccess, usuarioError, usuarioSuccessMessage, dispatch, usuarioErrorMessage])
    //unidades
    const unidadesLoading = useSelector(state => state.unidades.loading);
    const unidadesSuccess = useSelector(state => state.unidades.success);
    const unidadesSuccessMessage = useSelector(state => state.unidades.successMessage);
    const unidadesError = useSelector(state => state.unidades.error);
    const unidadesErrorMessage = useSelector(state => state.unidades.errorMessage);
    useEffect(() => {
        if (unidadesSuccess) {
            abrirAlertaCampos("success",unidadesSuccessMessage);
            dispatch(changeStateVehicle())
        }
        if (unidadesError) {
            abrirAlertaCampos("error",unidadesErrorMessage);
            dispatch(changeStateVehicle())
        }
    }, [unidadesSuccess, unidadesError, unidadesSuccessMessage, dispatch, unidadesErrorMessage])
    //cuentas
    const accountsLoading = useSelector(state => state.accounts.loading);
    const accountsSuccess = useSelector(state => state.accounts.success);
    const accountsSuccessMessage = useSelector(state => state.accounts.successMessage);
    const accountsError = useSelector(state => state.accounts.error);
    const accountsErrorMessage = useSelector(state => state.accounts.errorMessage);
    useEffect(() => {
        if (accountsSuccess) {
            abrirAlertaCampos("success",accountsSuccessMessage);
            dispatch(changeState())
        }
        if (accountsError) {
            abrirAlertaCampos("error",accountsErrorMessage);
            dispatch(changeState())
        }
    }, [accountsSuccess, accountsError, accountsSuccessMessage, dispatch, accountsErrorMessage])
    //dispositivos
    const devicesLoading = useSelector(state => state.devices.loading);
    const devicesSuccess = useSelector(state => state.devices.success);
    const devicesSuccessMessage = useSelector(state => state.devices.successMessage);
    const devicesError = useSelector(state => state.devices.error);
    const devicesErrorMessage = useSelector(state => state.devices.errorMessage);
    useEffect(() => {
        if (devicesSuccess) {
            abrirAlertaCampos("success",devicesSuccessMessage);
            dispatch(changeStateDevices())
        }
        if (devicesError) {
            abrirAlertaCampos("error",devicesErrorMessage);
            dispatch(changeStateDevices())
        }
    }, [devicesSuccess, devicesError, devicesSuccessMessage, dispatch, devicesErrorMessage])
    if (parseInt(localStorage_expiration) > 0) {
        const ticksToDate = require('ticks-to-date');
        const dateTimeRefresh = ticksToDate(parseInt(localStorage_expiration));
        var dateNow = new Date();
        var diffMs = (dateTimeRefresh - dateNow); // milliseconds between
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        if(diffMins < 1){
            //refresh token
            sessionStorage.setItem('expiration', 0);
            dispatch(refreshTokenAction())
        }
    }
    //#endregion
    //se debe hacer logging de nuevo
    useEffect(() => {
        var timerRefresh;
        const checkTime = () => {
            if(dateTicks){
                console.log(dateTicks)
                const date = ticksToDate(dateTicks);
                const dateBeforeExpire = new Date(date.getTime() - (4*60*1000));
                const currentDate = new Date();
                if(dateBeforeExpire <= currentDate){
                    //alert("expira en menos de 4 minutos")
                    console.log("expira en menos de 4 minutos");
                    if(localStorage_login === 'false'){
                        try {
                            dispatch(refreshTokenAction());
                        } catch (error) {
                            dispatch(logoutAction());
                        }
                    }
                }else{
                    var diffMs = (dateBeforeExpire - currentDate); // milliseconds between
                    //var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                    clearTimeout(timerRefresh);
                    timerRefresh = setTimeout(checkTime, diffMs)
                }
            }else{
                if(window.location.pathname !== "/login"){
                    if(localStorage_login === 'false'){
                        try {
                            dispatch(refreshTokenAction());
                        } catch (error) {
                            dispatch(logoutAction());
                        }
                    }
                }
            }
        }
        checkTime();
    }, [dateTicks])
    useEffect(() => {
        if (localStorage_login === 'false') {
            console.log("aqui")
            router.replace('/login')
        }
        if(!sessionStorage.getItem('loggedIn')){
            router.replace('/login')
        }
    }, [login,localStorage_login])
    return (
        login ||  localStorage_login === 'true' ?
            <>
                {
                    <div style={{position: "absolute",top: "40px",left: "65px", right:"0"}}>
                        <Component {...pageProps} />
                        {
                            usuarioLoading || unidadesLoading || accountsLoading || devicesLoading || zonesLoading || rulesLoading?
                            <div style={{position: "absolute",top: "0",left: "0", right:"0",bottom:"0",zIndex:"999"}}>
                                <Image className="preloaderImage" src={preloader} alt="loader" />
                                <Card className="preloaderCard" />
                            </div>
                            :
                            null
                        }
                    </div>
                }
            </>
        :
            null
    )
}
export default PrivateRoute;
