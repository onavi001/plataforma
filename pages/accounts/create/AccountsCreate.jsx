import React, { useState, useEffect } from 'react';
import { loadingAlerta, cerrarAlerta } from "../../../config/alerts";
import FullComponent from "../../../Components/FullComponent.jsx";
import BasicFormComponent from "../../../Components/BasicFormComponent.jsx";
import CardComponent from "../../../Components/CardComponent.jsx";
import TableComponent from "../../../Components/TableComponent.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { createAccountsAction } from "../../../store/actions/accountsActions";
import { getGlobalServicesAction } from "../../../store/actions/accountsActions";
import { abrirAlertaCampos } from "../../../config/alerts";
import { useRouter } from 'next/router'
import getText from "../../../config/languages";
import Link from 'next/link'
const AccountsCreate = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const elRefName = React.useRef();
    const elRefDescription = React.useRef();
    const elRefType = React.useRef();
    const elRefExternalId = React.useRef();
    const elRefodooId = React.useRef();
    const [ nameErrorState, setNameErrorState ] = useState('')
    const [ descriptionErrorState, setDescriptionErrorState ] = useState('')
    const [ typeErrorState, setTypeErrorState ] = useState('')
    const [ externalIdErrorState, setExternalIdErrorState ] = useState('')
    const [ odooIdErrorState, setOdooIdErrorState ] = useState('')
    const [ nameState, setNameState ] = useState('')
    const [ descriptionState, setDescriptionState ] = useState('')
    const [ typeState, setTypeState ] = useState('')
    const [ externalIdState, setExternalIdState ] = useState('')
    const [ odooIdState, setOdooIdState ] = useState('')
    const Titulo = getText("Formulario de captura",userLanguage);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        let pageName = "";
        pageName = "";
        const prefixName = "Crear cuenta";
        let flagPrincipal=false;
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
                <Link key={`AccountsGet_Link_${index}`} href={rout.path} >
                    <a style={{margin: "-4px 0 0 5px"}} className={index !== newRouts.length - 1 ? 'currenHeaderLink' : 'headerLink'}>
                        {index > 0 ? ' / ':null}
                        {`${getText(rout.prefix,userLanguage)} ${rout.name?': '+rout.name:''}`}
                    </a>
                </Link>
            ))
            }
        </span>
        ))
    }, [])
    const [dataInformationComponent, setDataInformationComponent] = useState([
        {prop:'Name',       fileName:getText('Cuenta',userLanguage),      value:'',ref:elRefName,         state:nameState,        setState: setNameState,       errorState:nameErrorState,setErrorState:setNameErrorState,infoData:'Longitud minima 8 caracteres' },
        {prop:'Description',fileName:getText('Descripción',userLanguage), value:'',ref:elRefDescription,  state:descriptionState, setState: setDescriptionState,errorState:descriptionErrorState,setErrorState:setDescriptionErrorState,infoData:'' },
        {prop:'Type',       fileName:getText('Tipo',userLanguage),        value:'',ref:elRefType,         state:typeState,        setState: setTypeState,       errorState:typeErrorState,setErrorState:setTypeErrorState,infoData:'',option:[
            {value:'cliente',label:'cliente'},
            {value:'master',label:'master'},
            {value:'Root',label:'Root'},
        ]},
        {prop:'ExternalId', fileName:getText('Id Externo',userLanguage),  value:'',ref:elRefExternalId,   state:externalIdState,  setState: setExternalIdState, errorState:externalIdErrorState,setErrorState:setExternalIdErrorState,infoData:'' },
        {prop:'OdooId',     fileName:getText('Id odoo',userLanguage),     value:'',ref:elRefodooId,       state:odooIdState,      setState: setOdooIdState,     errorState:odooIdErrorState,setErrorState:setOdooIdErrorState,infoData:'' },
    ])
    useEffect(() => {
        setDataInformationComponent([
            {prop:'Name',       fileName:getText('Cuenta',userLanguage),      value:'',ref:elRefName,         state:nameState,        setState: setNameState,       errorState:nameErrorState,          setErrorState:setNameErrorState,        infoData:getText('El nombre de la cuenta debe ser mayor a 8 caracteres',userLanguage) },
            {prop:'Description',fileName:getText('Descripción',userLanguage), value:'',ref:elRefDescription,  state:descriptionState, setState: setDescriptionState,errorState:descriptionErrorState,   setErrorState:setDescriptionErrorState, infoData:getText('Descripción breve sobre la cuenta',userLanguage) },
            {prop:'Type',       fileName:getText('Tipo',userLanguage),        value:'',ref:elRefType,         state:typeState,        setState: setTypeState,       errorState:typeErrorState,          setErrorState:setTypeErrorState,        infoData:'',option:[
                {value:'cliente',label:'cliente'},
                {value:'master',label:'master'},
                {value:'Root',label:'Root'},
            ]},
            {prop:'ExternalId', fileName:getText('Id Externo',userLanguage),  value:'',ref:elRefExternalId,   state:externalIdState,  setState: setExternalIdState, errorState:externalIdErrorState,    setErrorState:setExternalIdErrorState,  infoData:getText('Id para conectar con alguna plataforma externa',userLanguage) },
            {prop:'OdooId',     fileName:getText('Id odoo',userLanguage),     value:'',ref:elRefodooId,       state:odooIdState,      setState: setOdooIdState,     errorState:odooIdErrorState,        setErrorState:setOdooIdErrorState,      infoData:getText('Id de cuenta en Odoo',userLanguage) },
        ])
    }, [nameState, descriptionState, typeState, externalIdState, odooIdState, nameErrorState, descriptionErrorState, typeErrorState, externalIdErrorState, odooIdErrorState])
    const loadingAccounts = useSelector(state => state.accounts.loading);
    useEffect(() => {
        if (loadingAccounts) {
            loadingAlerta()
        }else{
            cerrarAlerta()
        }
    }, [loadingAccounts])
    const closeForm = (e) => {
        e.preventDefault();
        router.push("/accounts");
    }
    const validateFiles = (e) => {
        e.preventDefault();
        const nameTemp = dataInformationComponent[0].value;
        const descriptionTemp = dataInformationComponent[1].value;
        const typeTemp = dataInformationComponent[2].value;
        const odooIdTemp = dataInformationComponent[4].value;
        let errors = "";
        let validatorFlag = true;
        if(nameTemp.length <= 8) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===0){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('El nombre de la cuenta debe ser mayor a 8 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if(descriptionTemp.length <= 10) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===1){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Campo Descripción debe contener al menos 10 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if(typeTemp.length <= 0){
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===2){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Campo tipo vacio',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if(odooIdTemp.length <= 3){
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===4){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Id odoo debe contener al menos 2 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if(selectionModel.length <= 0){
            errors += `<li>${getText('Seleccione un servicio',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (validatorFlag) {
            createAccount();
        }else{
            abrirAlertaCampos('error',`<ul style='list-style: unset;'>${errors}</ul> `)
        }
    }
    const createAccount = () => {
        const nameTemp = dataInformationComponent[0].value;
        const descriptionTemp = dataInformationComponent[1].value;
        const typeTemp = dataInformationComponent[2].value;
        const externalIdTemp = dataInformationComponent[3].value ? dataInformationComponent[3].value : "ND" ;
        const odooIdTemp = dataInformationComponent[4].value;
        const newAccount = {
            "Name":nameTemp,
            "Description":descriptionTemp,
            "ExternalId":externalIdTemp,
            "OdooId":odooIdTemp,
            "Type":typeTemp,
        }
        let newServices = selectionModel.map( serId => {
            const foundservice = services.find(service => service.serviceId === serId )
            if (foundservice) {
                return {
                    Service_Id : foundservice.serviceId,
                    Name : foundservice.serviceName,
                    Description : foundservice.serviceDescription,
                    Active: true
                }
            }else{
                return null;
            }
        })
        newServices = newServices.filter(serv => serv !== null)
        newAccount.AccountServices = newServices;
        //reducer para crear
        console.log(newAccount)
        dispatch(createAccountsAction(newAccount))
    }
    const accoutnsError = useSelector(state => state.accounts.error);
    const accoutnsSuccess = useSelector(state => state.accounts.success);
    useEffect(() => {
        if(accoutnsSuccess){
            router.push("/accounts");
        }
    }, [accoutnsSuccess])
    const buttonGroupFooter = [
        {
            funcion : closeForm,
            nombre : getText("Cancelar",userLanguage),
            icono : null,
            clase : "intralixButton"
        },{
            funcion : validateFiles,
            nombre : getText("Registrar cuenta",userLanguage),
            icono : null,
            clase : "intralixButton"
        }

    ]
    //aqui empieza verticalComponent
    const services = useSelector(state => state.accounts.services);
    useEffect(() => {
        //Consultar la api
        if(!services){
            const loadServices = () => dispatch( getGlobalServicesAction() );
            loadServices()
        }
    }, [])
    const [ selectionModel,setSelectionModel ] = useState([])
    const ServiceComponentTitle = getText("Servicios",userLanguage);
    const columnsServiceComponents = [
        {
            field: 'id',
            headerName: 'id',
            width: 100,
            hide: true
        },{
            field: 'Name',
            headerName: getText('Nombre',userLanguage),
            width: 250,
            hide: false
        },{
            field: 'Description',
            flex:1,
            headerName: getText('Descripción',userLanguage),
            width: 350,
            hide: false
        }
    ];
    const setInitialRows = () => {
        const rowsServiceComponents = services.map(service => {
            return {
                id : service.serviceId,
                Name : getText(service.serviceName,userLanguage),
                Description : getText(service.serviceDescription,userLanguage),
            }
        })
        return rowsServiceComponents;
    }
    const [rowsServiceComponents, setRowsServiceComponents ] = useState([])

    useEffect(() => {
        if(services){
            setRowsServiceComponents(setInitialRows())
        }
    }, [services])
    return (
        <>
            <FullComponent
                Titulo={titleRouts}
                Body={BasicFormComponent}
                buttonGroupPage={buttonGroupFooter}
            />
            <CardComponent
                Titulo={Titulo}
                Body={BasicFormComponent}
                classComponent="accountCreateComponent"
                data={dataInformationComponent}
                setData={setDataInformationComponent}
            />
            <FullComponent
                Titulo={ServiceComponentTitle}
                Body={TableComponent}
                columns={columnsServiceComponents}
                rows={rowsServiceComponents}
                classGridComponent="accountCreateTableComponent"
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
            />
        </>
    );
}

export default AccountsCreate;
