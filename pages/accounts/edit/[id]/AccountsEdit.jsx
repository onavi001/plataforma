import React, { useState, useEffect } from 'react';
import CardComponent from "../../../../Components/CardComponent";
import FullComponent from "../../../../Components/FullComponent";
import BasicFormComponent from "../../../../Components/BasicFormComponent";
import TableComponent from "../../../../Components/TableComponent";
import { useDispatch,useSelector } from 'react-redux'
import { upodateAccountsAction, getAccountByIdAction, getServicesAccountAction } from "../../../../store/actions/accountsActions"
import { abrirAlerta, abrirAlertaCampos } from "../../../../config/alerts";
import getText from "../../../../config/languages";
import { useRouter } from 'next/router';
import Link from 'next/link';
const AccountsEdit = ({...pageProps}) => {
    const dispatch = useDispatch();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const router = useRouter();

    const Titulo = getText("Actualizar Información de la Cuenta",userLanguage)
    const { id } = pageProps.router.query
    const account = useSelector(state => state.accounts.account);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        let pageName = "";
        console.log(account)
        if(account && account.id === id){
            pageName = account.name;
            const prefixName = "Editar cuenta";
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
                    <Link key={`AccountsEdit_Link_${index}`} href={rout.path} >
                        <a style={{margin: "-4px 0 0 5px"}} className={index !== newRouts.length - 1 ? 'currenHeaderLink' : 'headerLink'}>
                            {index > 0 ? ' / ':null}
                            {`${getText(rout.prefix,userLanguage)} ${rout.name?': '+rout.name:''}`}
                        </a>
                    </Link>
                ))
                }
            </span>
            ))
        }
    }, [account])
    useEffect(() => {
        //Consultar la api
        if(!account){
            if(id){
                const cargarCuentas = () => dispatch( getAccountByIdAction(id) );
                cargarCuentas();
            }
        }else{
            if(id){
                if(account.id !== id){
                    const cargarCuentas = () => dispatch( getAccountByIdAction(id) );
                    cargarCuentas();
                }
            }
        }
    }, [dispatch, id])
    useEffect(() => {
        if (account) {
            setNameState(account.name)
            setDescriptionState(account.description)
            setTypeState(account.type)
            setExternalIdState(account.externalId)
            setOdooIdState(account.odooId)
        }
    }, [account])
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
    const [ nameState,setNameState] = useState('')
    const [ descriptionState,setDescriptionState] = useState('')
    const [ typeState,setTypeState] = useState('')
    const [ externalIdState,setExternalIdState] = useState('')
    const [ odooIdState,setOdooIdState] = useState('')
    useEffect(() => {
        setDataInformationComponent([
            {prop:'Name',       fileName:getText('Cuenta',userLanguage),      value:nameState,ref:elRefName,         state:nameState,        setState: setNameState,         errorState:nameErrorState,          setErrorState:setNameErrorState,        infoData:getText('El nombre de la cuenta debe ser mayor a 8 caracteres',userLanguage) },
            {prop:'Description',fileName:getText('Descripción',userLanguage), value:nameState,ref:elRefDescription,  state:descriptionState, setState: setDescriptionState,  errorState:descriptionErrorState,   setErrorState:setDescriptionErrorState, infoData:getText('Descripción breve sobre la cuenta',userLanguage) },
            {prop:'Type',       fileName:getText('Tipo',userLanguage),        value:nameState,ref:elRefType,         state:typeState,        setState: setTypeState,         errorState:typeErrorState,          setErrorState:setTypeErrorState,        infoData:'',option:[
                {value:'cliente',label:'cliente'},
                {value:'master',label:'master'},
                {value:'Root',label:'Root'},
            ]},
            {prop:'ExternalId', fileName:getText('Id Externo',userLanguage),  value:nameState,ref:elRefExternalId,   state:externalIdState,  setState: setExternalIdState,   errorState:externalIdErrorState,    setErrorState:setExternalIdErrorState,  infoData:getText('Id para conectar con alguna plataforma externa',userLanguage) },
            {prop:'OdooId',     fileName:getText('Id odoo',userLanguage),     value:nameState,ref:elRefodooId,       state:odooIdState,      setState: setOdooIdState,       errorState:odooIdErrorState,        setErrorState:setOdooIdErrorState,      infoData:getText('Id de cuenta en Odoo',userLanguage) },
        ])
    }, [nameState, descriptionState, typeState, externalIdState, odooIdState, nameErrorState, descriptionErrorState, typeErrorState, externalIdErrorState, odooIdErrorState])
    const [dataInformationComponent, setDataInformationComponent] = useState([
        {prop:"name", fileName:"Cuenta",value:"", ref: elRefName, state:nameState, setState: setNameState},
        {prop: 'description',fileName: 'Descripción',value : "",ref: elRefDescription,state:descriptionState, setState: setDescriptionState},
        {prop: 'type',fileName: 'Tipo',value : "master",ref: elRefType,option:[
            {value:"cliente",label:"cliente"},
            {value:"master",label:"master"},
            {value:"Root",label:"Root"},
        ],state:typeState, setState: setTypeState},
        {prop: 'externalId',fileName: 'ID Externo',value : "",ref: elRefExternalId, state:externalIdState, setState: setExternalIdState},
        {prop: 'odooId',fileName: 'ID odoo',value : "asasa",ref: elRefodooId, state:odooIdState, setState: setOdooIdState},
    ])
    const closeForm = (e) => {
        e.preventDefault();
        router.push("/accounts");
    }
    const validateFilesUpdate = (e) => {
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
            //abrirAlertaCampos("error",`Campo Descripción debe contener al menos 10 caracteres`);
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===1){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Campo Descripción debe contener al menos 10 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if(typeTemp.length <= 0){
            //abrirAlertaCampos("error",`Campo Tipo vacio`);
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===2){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Campo tipo vacio',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if(odooIdTemp.length <= 3){
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===4){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Id odoo debe contener al menos 2 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if (validatorFlag) {
            updateAccount();
        }else{
            abrirAlertaCampos('error',`<ul style='list-style: unset;'>${errors}</ul> `)
        }
    }
    const updateAccount = () => {
       //cuneta
        let flagChangeInformationAccount = false;
        const newAccount={
            "name": dataInformationComponent[0].state,
            "description": dataInformationComponent[1].state,
            "type": dataInformationComponent[2].state,
            "externalId": dataInformationComponent[3].state ? dataInformationComponent[3].state : "ND",
            "odooId": dataInformationComponent[4].state,
            "status": 1,
            "Active": account.active
        }
        if (newAccount.name !== account.name)
            flagChangeInformationAccount=true;
        else if(newAccount.description !== account.description)
            flagChangeInformationAccount=true;
        else if(newAccount.type !== account.type)
            flagChangeInformationAccount=true;
        else if(newAccount.externalId !== account.externalId)
            flagChangeInformationAccount=true;
        else if(newAccount.odooId !== account.odooId)
            flagChangeInformationAccount=true;
        //return true;
        //servicess
        let newServices = selectionModel.map( serId => {
            const foundservice = services.find(service => service.serviceId === serId )
            if (foundservice) {
                return {
                    service_Id : foundservice.serviceId,
                    name : foundservice.serviceName,
                    description : foundservice.serviceDescription,
                    active: true
                }
            }else{
                return null;
            }
        })
        newServices = newServices.filter(serv => serv !== null)
        let flagChangeServicesAccount = false;
        const currentServices = account.accountServices;
        newServices.forEach(newService => {
            const found = currentServices.find(currentService => currentService.catalogId === newService.service_Id)
            if (!found) {
                flagChangeServicesAccount = true;
            }
        });
        if (!flagChangeServicesAccount) {
            newServices.forEach(newService => {
                const found = currentServices.find(currentService => currentService.catalogId === newService.service_Id)
                if (found) {
                    if (found.active !== newService.active) {
                        flagChangeServicesAccount = true;
                    }
                }
            });
        }
        if (newServices.length < currentServices.filter(service => service.active).length) {
            flagChangeServicesAccount = true;
        }
        if (flagChangeServicesAccount) {
            newServices = newServices.map(service => {
                const found = services.find(ser => ser.serviceId === service.service_Id)
                return found;
            })
        }
        const dateToUpdate = {
            newAccount,
            flagChangeInformationAccount,
            newServices,
            flagChangeServicesAccount,
            account
        }
        if(flagChangeInformationAccount === false && flagChangeServicesAccount  === false){
            //no hay nada que cambair
            abrirAlerta("warning",getText("No se encontraron cambios",userLanguage))
        }else{
            //reducer para editar
            dispatch(upodateAccountsAction(dateToUpdate))
            router.push("/accounts");
        }
    }
    const buttonGroupFooter = [
        {
            funcion : closeForm,
            nombre : getText("Cancelar",userLanguage),
            icono : null,
            clase : "intralixButton"
        },{
            funcion : validateFilesUpdate,
            nombre : getText("Actualizar Cuenta",userLanguage),
            icono : null,
            clase : "intralixButton"
        }

    ]
    //aqui empieza Table component
    const services = useSelector(state => state.accounts.services)
    useEffect(() => {
        if(!services){
            const loadServices = () => dispatch( getServicesAccountAction() );
            loadServices()
        }
    }, [])
    useEffect(() => {
        if (services) {
            setRowsServiceComponents(setInitialRows())
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [services])
    const [ selectionModel,setSelectionModel ] = useState([])
    useEffect(() => {
        if (account) {
            let activeService = account.accountServices.map(service => {
                if(service.active){
                    return service.catalogId;
                }else{
                    return null
                }
            })
            activeService = activeService.filter(id => id !== null)
            setSelectionModel(activeService)
        }
    }, [account])
    const ServiceComponentTitle = getText("Servicios",userLanguage);
    const columnsServiceComponents = [
        {
            field: 'id',
            headerName: 'id',
            minWidth: 100,
            hide: true
        },{
            field: 'Name',
            headerName: getText('Nombre',userLanguage),
            minWidth: 250,
            hide: false
        },{
            field: 'Description',
            headerName: getText('Descripción',userLanguage),
            flex: 1,
            minWidth: 350,
            hide: false
        }
    ];
    const setInitialRows = () => {
        let rowsServiceComponents = services.map(service => {
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
                buttonGroupPage={buttonGroupFooter}
            />
            <CardComponent
                Titulo={Titulo}
                Body={BasicFormComponent}
                classComponent="accountEditComponent"
                data={dataInformationComponent}
                setData={setDataInformationComponent}
            />
            <FullComponent
                Titulo={ServiceComponentTitle}
                Body={TableComponent}
                columns={columnsServiceComponents}
                rows={rowsServiceComponents}
                classGridComponent="gridAccountsCreateServices"
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
            />
        </>
    );
}

export default AccountsEdit;
