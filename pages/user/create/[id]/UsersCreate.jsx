import React, { useState, useEffect } from "react";
import CardComponent from "../../../../Components/CardComponent";
import FullComponent from "../../../../Components/FullComponent";
import BasicFormComponent from "../../../../Components/BasicFormComponent";
import { useDispatch, useSelector } from 'react-redux'
import { getAccountsAction, getAccountByIdAction } from "../../../../store/actions/accountsActions"
import { createUsersAction } from "../../../../store/actions/usuarioActions";
import TableComponent from "../../../../Components/TableComponent";
import { abrirAlertaCampos } from "../../../../config/alerts";
import getText from "../../../../config/languages";
import { useRouter } from 'next/router'
import Link from 'next/link'
const UsersCreate = ({...pageProps}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        let pageName = "";
        const prefixName = "Registrar Usuario";
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
        console.log(prefixName)
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
        sessionStorage.setItem('rout', JSON.stringify(newRouts));
        //setCurrentRouts(routs)
        setTitleRouts(()=>(
        <span>
            {
            newRouts.map((rout,index)=>(
                <Link key={`AccountsGet_Link_${index}`} href={rout.path} >
                <a style={{margin: "-4px 0 0 5px"}} className={index !== newRouts.length - 1 ? 'currenHeaderLink' : 'headerLink'} >
                    {index > 0 ? ' / ':null}
                    {`${getText(rout.prefix,userLanguage)} ${rout.name?': '+rout.name:''}`}
                </a>
                </Link>
            ))
            }
        </span>
        ))
    }, [])
    const userUserType = useSelector(state => state.usuario.userType);
    const { id } = pageProps.router.query
    const [ nameErrorState, setNameErrorState ] = useState('')
    const [ emailErrorState, setEmailErrorState ] = useState('')
    const [ passwordErrorState, setPasswordErrorState ] = useState('')
    const [ repeatPasswordErrorState, setRepeatPasswordErrorState ] = useState('')
    const [ typeErrorState, setTypeErrorState ] = useState('')
    const [ accountErrorState, setAccountErrorState ] = useState('')

    const [ nameState, setNameState ] = useState('')
    const [ emailState, setEmailState ] = useState('')
    const [ passwordState, setPasswordState ] = useState('')
    const [ repeatPasswordState, setRepeatPasswordState ] = useState('')
    const [ typeState, setTypeState ] = useState('')
    const [ accountState, setAccountState ] = useState(id)
    const Titulo = getText('Registrar Usuario',userLanguage);
    const userTypes = useSelector(state => state.usuario.userTypes);
    const user = useSelector(state => state.usuario.user);
    const Accounts = useSelector(state => state.accounts.accounts);
    const account = useSelector(state => state.accounts.account);
    useEffect(() => {
        //Consultar la api
        if (userUserType === 1) {
            if(!Accounts){
                const loadAccounts = () => dispatch( getAccountsAction() );
                loadAccounts();
            }
            if(!account){
                const loadAccount = () => dispatch( getAccountByIdAction(id) );
                loadAccount();
            }
        }
    }, [dispatch, id, userTypes])
    useEffect(() => {
        if (account) {
            setAccountState(account.id)
            if (Accounts) {
                Accounts.push(account)
            }
        }
    }, [account,Accounts])
    useEffect(() => {
        if (user) {
            const AccountsName = Accounts ? Accounts.map( acc => ({value:acc.id,label:acc.name})) : [];
            const tempoComponent = [
                {prop:"userName",       fileName:getText('Nombre del Usuario',userLanguage),value:nameState,            state:nameState,            setState:setNameState,          errorState:nameErrorState,          setErrorState:setNameErrorState,            infoData: getText('El nombre de usuario debe de contener al menos 8 caracteres',userLanguage) },
                {prop:"email",          fileName:getText('Correo',userLanguage),            value:emailState,           state:emailState,           setState:setEmailState,         errorState:emailErrorState,         setErrorState:setEmailErrorState,           infoData: '' },
                {prop:"password",       fileName:getText('Contraseña',userLanguage),        value:passwordState,        state:passwordState,        setState:setPasswordState,      errorState:passwordErrorState,      setErrorState:setPasswordErrorState,        infoData: getText('La contraseña debe ser mayor a 8 caracteres, debe contener mayúsculas, minusculas, numero y carácter especial',userLanguage),  type:"password"},
                {prop:"repeatPassword", fileName:getText('Repetir contraseña',userLanguage),value:repeatPasswordState,  state:repeatPasswordState,  setState:setRepeatPasswordState,errorState:repeatPasswordErrorState,setErrorState:setRepeatPasswordErrorState,  infoData: getText('La contraseña debe ser mayor a 8 caracteres, debe contener mayúsculas, minusculas, numero y carácter especial',userLanguage),  type:"password"},
                {prop:"type",           fileName:getText('Tipo',userLanguage),              value:typeState,            state:typeState,            setState:setTypeState,          errorState:typeErrorState,          setErrorState:setTypeErrorState,            option:userTypes.map(type => ({value:type.id,label:type.name}) )},
            ];
            if (userUserType === 1) {
                tempoComponent.push({
                    prop:"accountId",
                    fileName: getText("Cuenta",userLanguage),
                    value:accountState,
                    state:accountState,
                    errorState:accountErrorState,
                    setErrorState:setAccountErrorState,
                    option:AccountsName})
            }
            setDataInformationComponent(tempoComponent)
        }
    }, [account, Accounts, user, nameState, nameErrorState, emailState, emailErrorState, passwordState, passwordErrorState, repeatPasswordState, repeatPasswordErrorState, typeState, typeErrorState, userTypes, userUserType, accountState, accountErrorState])
    const [dataInformationComponent, setDataInformationComponent] = useState([])
    const validateBasicFilesCreate = (e) => {
        e.preventDefault();
        let errors = '';
        const nameTemp = dataInformationComponent[0].state;
        const emailTemp = dataInformationComponent[1].state;
        const passwordTemp = dataInformationComponent[2].state;
        const repeatPasswordTemp = dataInformationComponent[3].state;
        const userTypeTemp = dataInformationComponent[4].state;

        let validatorFlag = true;
        if(nameTemp.length < 8) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===0){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('El nombre de usuario debe de contener al menos 8 caracteres',userLanguage)}</li>`;
            validatorFlag = false;
        }
        const emailVal = validateEmail(emailTemp)
        if(!emailVal) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===1){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Formato de correo invalido',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if(userTypeTemp.length <= 0) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===4){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Campo tipo vacio',userLanguage)}</li>`;
            validatorFlag = false;
        }
        if(passwordTemp !== repeatPasswordTemp) {
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===2){dat.errorState ='inputError';} return dat; }))
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===3){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Contraseñas no coinciden',userLanguage)}</li>`
            validatorFlag = false;
        }else if(!validatePassword(passwordTemp)){
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===2){dat.errorState ='inputError';} return dat; }))
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===3){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('Formato de contraseña invalido',userLanguage)}</li>`
            validatorFlag = false;
        }
        if (validatorFlag) {
            nextComponent();
        }else{
            abrirAlertaCampos('error',`<ul style='list-style: unset;'>${errors}</ul> `)
        }
    }
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    function validatePassword(password) {
        if(password.length < 7){
            return false;
        }else if (!password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){// If password contains both lower and uppercase characters, increase strength value.
            return false;
        }else if (!password.match(/([a-zA-Z])/) && password.match(/([0-9])/)){// If it has numbers and characters, increase strength value.
            return false;
        }else if (!password.match(/([!,%,&,@,#,$,^,*,?,_,~,.])/)){// If it has one special character, increase strength value.
            return false;
        }else{
            return true;
        }
    }
    const nextComponent = () => {
        setInfoToForm(false)
    }
    const closeForm = (e) => {
        e.preventDefault();
        router.push("/accounts");
    }
    const buttonGroupFooterDtaInformation = [
        {
            funcion : closeForm,
            nombre : getText("Cancelar",userLanguage),
            icono : null,
            clase : "neutroButton"
        },{
            funcion : validateBasicFilesCreate,
            nombre : getText("Siguiente",userLanguage),
            icono : null,
            clase : "intralixButton"
        }
    ]
    //Table componente for roles
    const tableRoleComponentTitle = getText("Roles",userLanguage)
    const [ selectionModel,setSelectionModel ] = useState([])
    useEffect(() => {
        if (Accounts && account && accountState) {
            const accountR = Accounts.find(accountC => accountC.id === accountState)
            const accountRoles = accountR.accountRoles;

            setRowsTableRoleComponents(setInitialRows(accountRoles))
        }else{
            if (user) {
                setRowsTableRoleComponents(setInitialRows(user.roles))
            }
        }
    }, [Accounts,account,accountState,user])
    const columnsTableRoleComponents = [
        {
            field: 'id',
            headerName: 'id',
            width: 100,
            hide: true
        },{
            field: 'name',
            headerName: getText('Nombre',userLanguage),
            width: 250,
            hide: false
        },{
            field: 'description',
            headerName: getText('Description',userLanguage),
            flex: 1,
            minWidth: 350,
            hide: false
        }
    ];
    const setInitialRows = (accountRoles) => {
        let rowsServiceComponents = accountRoles.map(role => {
            return {
                id : role.id,
                name : role.name,
                description : role.description,
            }
        })
        return rowsServiceComponents;
    }
    const previusComponent = (e) => {
        e.preventDefault();
        setInfoToForm(true)
    }
    const createUser = (e) => {
        e.preventDefault();
        if (selectionModel.length > 0) {
            const nameTemp = dataInformationComponent[0].state;
            const emailTemp = dataInformationComponent[1].state;
            const passwordTemp = dataInformationComponent[2].state;
            const userTypeTemp = dataInformationComponent[4].state;
            const accountTemp = dataInformationComponent[5] ? dataInformationComponent[5].state : accountState;
            const userToSave = {
                "Name"  :nameTemp,
                "Email" : emailTemp,
                "Password" : passwordTemp,
                "AccountId" : accountTemp,
                "Type": userTypeTemp,
                "Roles": selectionModel
            }
            //reducer para crear
            dispatch(createUsersAction(userToSave))
            router.push(`/accounts/${id}`);
        }else{
            abrirAlertaCampos("error",getText('Seleccione al menos un <strogn>Rol</strogn>',userLanguage));
        }
    }
    const buttonGroupFooter = [
        {
            funcion : previusComponent,
            nombre : getText("Regresar",userLanguage),
            icono : null,
            clase : "neutroButton"
        },{
            funcion : createUser,
            nombre : getText("Registrar Usuario",userLanguage),
            icono : null,
            clase : "intralixButton"
        }
    ]
    const [rowsTableRoleComponents, setRowsTableRoleComponents ] = useState()
    const [infoToForm, setInfoToForm] = useState(true)
    return (
        <>
            <FullComponent
                Titulo={titleRouts}
            />
            {
                infoToForm ?
                    <CardComponent
                        Titulo={Titulo}
                        Body={BasicFormComponent}
                        classComponent="bodyHomeComponent"
                        data={dataInformationComponent}
                        setData={setDataInformationComponent}
                        buttonGroupFooter={buttonGroupFooterDtaInformation}
                    />
                :
                    <FullComponent
                        Titulo={tableRoleComponentTitle}
                        Body={TableComponent}
                        columns={columnsTableRoleComponents}
                        rows={rowsTableRoleComponents}
                        classGridComponent="gridAccountsCreateServices"
                        buttonGroupPage={buttonGroupFooter}
                        //buttonGroupFooter={buttonGroupFooter}
                        selectionModel={selectionModel}
                        setSelectionModel={setSelectionModel}
                    />
            }
        </>
    );
}

export default UsersCreate;
