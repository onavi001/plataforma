import React, { useState, useEffect } from "react";
import CardComponent from "../../../Components/CardComponent";
import BasicFormComponent from "../../../Components/BasicFormComponent";
import { useDispatch, useSelector } from 'react-redux'
import { createUnitsAction } from "../../../store/actions/unidadesActions"
import { getDevicesAction } from "../../../store/actions/devicesActions";
import { getAccountsAction, getAccountByIdAction } from "../../../store/actions/accountsActions"
import { abrirAlertaCampos } from "../../../config/alerts";
import getText from "../../../config/languages";
import FullComponent from "../../../Components/FullComponent";
import { useRouter } from 'next/router';
import Link from 'next/link';
const VehiclesCreate = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const Titulo = getText("Registrar Unidad",userLanguage);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        const pageName = "";
        const prefixName = "Registrar Unidad";
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
                <Link key={`VehiclesCreate_Link_${index}`} href={rout.path} >
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
    const userUserType = useSelector(state => state.usuario.userType);
    //#region stateForm
    const [nickErrorState, setNickErrorState] = useState();
    const [marckErrorState, setMarckErrorState] = useState();
    const [modelErrorState, setModelErrorState] = useState();
    const [platesErrorState, setPlatesErrorState] = useState();
    const [colorErrorState, setColorErrorState] = useState();
    const [yearErrorState, setYearErrorState] = useState();
    const [typeErrorState, setTypeErrorState] = useState();
    const [vinErrorState, setVinErrorState] = useState();
    const [statusErrorState, setStatusErrorState] = useState();
    const [efficiencyErrorState, setEfficiencyErrorState] = useState();
    const [detailsErrorState, setDetailsErrorState] = useState();
    const [gpsDevicesErrorState, setGpsDevicesErrorState] = useState();
    const [accountErrorState, setAccountErrorState] = useState();
    const [nickState, setNickState] = useState('');
    const [marckState, setMarckState] = useState('');
    const [modelState, setModelState] = useState('');
    const [platesState, setPlatesState] = useState('');
    const [colorState, setColorState] = useState('');
    const [yearState, setYearState] = useState('');
    const [typeState, setTypeState] = useState('');
    const [vinState, setVinState] = useState('');
    const [statusState, setStatusState] = useState("sin GPS");
    const [efficiencyState, setEfficiencyState] = useState('');
    const [detailsState, setDetailsState] = useState('');
    const [gpsDevicesState, setGpsDevicesState] = useState('');
    //#endregion
    const [, setAccountState] = useState();
    const devices = useSelector(state => state.devices.devices);
    const account = useSelector(state => state.accounts.account);
    const accounts = useSelector(state => state.accounts.accounts);
    const user = useSelector(state => state.usuario.user);
    const undiadesTypes = useSelector(state => state.unidades.Types);
    const undiadesMarks = useSelector(state => state.unidades.Marks);
    const undiadesModels = useSelector(state => state.unidades.Models);
    const unidadesStatus = useSelector(state => state.unidades.status);
    useEffect(() => {
        if(!devices){
            const loadDevices = () => dispatch( getDevicesAction() );
            loadDevices();
        }
        if (!accounts && (userUserType === 1)) {
            const loadAccounts = () => dispatch( getAccountsAction() );
            loadAccounts();
        }
    }, [dispatch, userUserType])
    useEffect(() => {
        if (!account && (userUserType === 1 || userUserType === 2)) {
            const loadAccount = () => dispatch( getAccountByIdAction(user.accountId) );
            loadAccount();
        }
    }, [user])
    let [dataInformationComponent, setDataInformationComponent] = useState([])
    const changeMark = (e,data) => {
        const modelsOfMArk = undiadesModels.filter(models => models.parentMark === e.target.value)
        const temp = data.map(dat => {
            if(dat.prop === 'Model'){
                dat.option = modelsOfMArk.map(type => ({value:type.id, label:type.name}))
            }
            if(dat.prop === 'Mark'){
                dat.value = e.target.value
                dat.state = e.target.value
            }
            return dat;
        })
        return temp;
    }
    const validateState = (e,data) => {
        const Status = e.target.value;
        const Devices = data[11].state;
        console.log(Status)
        console.log(Devices)
        console.log(data)
        if(Devices.length <= 0){
            const temp = data.map(dat => {
                if(dat.prop === 'Status'){
                    dat.value = 'sin GPS';
                    dat.state = 'sin GPS';
                }
                return dat;
            })
            return temp;
        }else{
            const temp = data.map(dat => {
                if(dat.prop === 'Status'){
                    if(e.target.value !== 'sin GPS'){
                        dat.value = e.target.value
                        dat.state = e.target.value
                    }
                }
                return dat;
            })
            return temp;
        }
    }
    const validateStateGPS = (e,value,data) => {
        const Status = data[8].state;
        const Devices = value;
        console.log(Status)
        console.log(Devices)
        console.log(data)
        if(Devices.length <= 0){
            const temp = data.map(dat => {
                if(dat.prop === 'Status'){
                    dat.value = 'sin GPS';
                    dat.state = 'sin GPS';
                }
                if(dat.prop === 'gpsDevices'){
                    dat.value = value;
                    dat.state = value;
                }
                return dat;
            })
            return temp;
        }else{
            const temp = data.map(dat => {
                if(dat.prop === 'gpsDevices'){
                    dat.value = value;
                    dat.state = value;
                }
                if(dat.prop === 'Status'){
                    if(Status === 'sin GPS'){
                        dat.value = '';
                        dat.state = '';
                    }
                }
                return dat;
            })
            return temp;
        }
    }
    useEffect(() => {
        if (user && devices) {
            const tempoComponentProps = [
                {prop:"Nick",       fileName:getText("Nombre",userLanguage),      value:nickState,        state:nickState,        setState:setNickState,      errorState:nickErrorState,      setErrorState:setNickErrorState,        infoData: getText('Nombre de la unidad. longitud máxima: 100, longitud mínima 5',userLanguage)},
                {prop:"Mark",       fileName:getText("Marca",userLanguage),       value:marckState,       state:marckState,       setState:setMarckState,     errorState:marckErrorState,     setErrorState:setMarckErrorState,       onClickFuntion:changeMark,  infoData: '',option:undiadesMarks.map(type => ({value:type.id, label:type.name}))},
                {prop:"Model",      fileName:getText("Modelo",userLanguage),      value:modelState,       state:modelState,       setState:setModelState,     errorState:modelErrorState,     setErrorState:setModelErrorState,       infoData: '',option:[]},
                {prop:"Plates",     fileName:getText("Placas",userLanguage),      value:platesState,      state:platesState,      setState:setPlatesState,    errorState:platesErrorState,    setErrorState:setPlatesErrorState,      infoData: getText('Placas de la unidad. longitud máxima: 10, longitud mínima 5',userLanguage)},
                {prop:"Color",      fileName:getText("Color",userLanguage),       value:colorState,       state:colorState,       setState:setColorState,     errorState:colorErrorState,     setErrorState:setColorErrorState,       infoData: ''},
                {prop:"Year",       fileName:getText("Año",userLanguage),         value:yearState,        state:yearState,        setState:setYearState,      errorState:yearErrorState,      setErrorState:setYearErrorState,        infoData: ''},
                {prop:"Type",       fileName:getText("Tipo",userLanguage),        value:typeState,        state:typeState,        setState:setTypeState,      errorState:typeErrorState,      setErrorState:setTypeErrorState,        infoData: '',option:undiadesTypes.map(type => ({value:type.id, label:type.name}))},
                {prop:"Vin",        fileName:getText("No. Serie",userLanguage),   value:vinState,         state:vinState,         setState:setVinState,       errorState:vinErrorState,       setErrorState:setVinErrorState,         infoData: getText('Numero de serie de la unidad. longitud máxima: 50, longitud mínima 5',userLanguage)},
                {prop:"Status",     fileName:getText("Estatus",userLanguage),     value:statusState,      state:statusState,      setState:setStatusState,    errorState:statusErrorState,    setErrorState:setStatusErrorState,      onClickFuntion:validateState, infoData: '', option:unidadesStatus.map(type => ({value:type.id, label:getText(type.name,userLanguage)}))},
                {prop:"Efficiency", fileName:getText("Rendimiento",userLanguage), value:efficiencyState,  state:efficiencyState,  setState:setEfficiencyState,errorState:efficiencyErrorState,setErrorState:setEfficiencyErrorState,  infoData: ''},
                {prop:"Details",    fileName:getText("Detalles",userLanguage),    value:detailsState,     state:detailsState,     setState:setDetailsState,   errorState:detailsErrorState,   setErrorState:setDetailsErrorState,     infoData: ''},
                {prop:"gpsDevices", fileName:getText("Dispositivos",userLanguage),value:[],               state:gpsDevicesState,  setState:setGpsDevicesState,errorState:gpsDevicesErrorState,setErrorState:setGpsDevicesErrorState,  onClickFuntion:validateStateGPS, infoData: '', type:"Autocomplete", option:devices.map(device => (device.movilId)) },
            ];
            if(account && accounts){
                tempoComponentProps.push(
                    {
                        prop:"AccountId",
                        fileName:getText("Cuenta",userLanguage),
                        value:user.accountId,
                        state:user.accountId,
                        setState:setAccountState,
                        errorState:accountErrorState,
                        setErrorState:setAccountErrorState,
                        infoData: '',
                        option: accounts.length > 0 ? accounts.map(account => ( {value:account.id,label:account.name} )) : [{value:account.id,label:account.name}] },
                )
            }
            setDataInformationComponent(tempoComponentProps)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [devices, accounts, user, account, nickState, nickErrorState, marckState, marckErrorState, undiadesMarks, modelState, modelErrorState, platesState, platesErrorState, colorState, colorErrorState, yearState, yearErrorState, typeState, typeErrorState, undiadesTypes, vinState, vinErrorState, statusState, statusErrorState, unidadesStatus, efficiencyState, efficiencyErrorState, detailsState, detailsErrorState, gpsDevicesState, gpsDevicesErrorState, accountErrorState])
    const closeForm = (e) => {
        e.preventDefault();
        router.push("/vehicles");
    }
    const validateVehicle = (newVehicle) => {
        let errors = "";
        let validatorFlag = true;
        if (newVehicle.Nick.length < 5) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===0){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Nombre debe contener al menos 5 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (newVehicle.Mark.length < 4) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===1){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('La marca debe contener al menos 4 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (newVehicle.Model.length < 4) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===2){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('El modelo debe contener al menos 4 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (newVehicle.Plates.length < 5) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===3){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Las placas debe contener al menos 4 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (newVehicle.Year) {
            const year = newVehicle.Year
            var text = /^[0-9]+$/;
            if (!text.test(year) ) {
                setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===5){dat.errorState ='inputError';} return dat; }))
                errors += `<li>${getText('Formato de año invalido',userLanguage)}</li>`;
                validatorFlag = false;
            }else if (year.length !== 4) {
                setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===5){dat.errorState ='inputError';} return dat; }))
                errors += `<li>${getText('Formato de año invalido',userLanguage)}</li>`;
                validatorFlag = false;
            }else if(year < 1920){
                setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===5){dat.errorState ='inputError';} return dat; }))
                errors += `<li>${getText('Formato de año invalido',userLanguage)}</li>`;
                validatorFlag = false;
            }
        }
        if (!newVehicle.Type) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===6){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Campo Tipo requerido',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (newVehicle.VIN.length < 5) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===7){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('El numero de serie debe contener al menos 5 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (!newVehicle.Status) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===8){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Campo Estado requerido',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (!validatorFlag) {
            abrirAlertaCampos('error',`<ul style='list-style: unset;'>${errors}</ul> `)
        }
        return validatorFlag;
    }
    const createVehicle = (e) => {
        e.preventDefault();
        const newVehicle = {
            Nick : dataInformationComponent[0].state,
            Mark : dataInformationComponent[1].state,
            Model : dataInformationComponent[2].state,
            Plates : dataInformationComponent[3].state,
            Color : dataInformationComponent[4].state,
            Year : dataInformationComponent[5].state,
            Type : dataInformationComponent[6].state,
            VIN : dataInformationComponent[7].state,
            Status : dataInformationComponent[8].state,
            Efficiency : dataInformationComponent[9].state ? parseFloat(dataInformationComponent[9].state) : 0.0,
            Details : dataInformationComponent[10].state,
            Devices : dataInformationComponent[11].state,
            AccountId : dataInformationComponent[12] ? dataInformationComponent[12].state : user.accountId,
        };
        const validatorFlag = validateVehicle(newVehicle)
        if (validatorFlag) {
            newVehicle.Year = parseFloat(newVehicle.Year);
            dispatch(createUnitsAction(newVehicle))
        }
    }
    const vehiclesError = useSelector(state => state.unidades.error);
    const vehiclesSuccess = useSelector(state => state.unidades.success);
    useEffect(() => {
        if(vehiclesSuccess){
            router.push("/vehicles");
        }
    }, [vehiclesSuccess])
    const buttonGroupFooter = [
        {
            funcion : closeForm,
            nombre : getText("Cancelar",userLanguage),
            icono : null,
            clase : "intralixButton"
        },{
            funcion : createVehicle,
            nombre : getText("Registrar Unidad",userLanguage),
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
                Body={BasicFormComponent}
                classComponent="bodyVehiclesCreateComponent"
                data={dataInformationComponent}
                setData={setDataInformationComponent}
                buttonGroupFooter={buttonGroupFooter}
            />
        </>
    );
}

export default VehiclesCreate;
