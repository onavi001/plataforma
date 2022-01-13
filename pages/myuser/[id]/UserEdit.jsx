import React, { useState, useEffect } from "react";
import CardComponent from "../../../Components/CardComponent";
import BasicFormComponent from "../../../Components/BasicFormComponent";
import { useDispatch, useSelector } from 'react-redux';
import { getAccountByIdAction } from "../../../store/actions/accountsActions"
import { getUsersAction, getUserByIdAction } from "../../../store/actions/usuarioActions"
import { editUsersAction } from "../../../store/actions/usuarioActions";
import { abrirAlertaCampos } from "../../../config/alerts";
import getText from "../../../config/languages";
import FullComponent from "../../../Components/FullComponent";
import { useRouter } from 'next/router'
import Link from 'next/link'
const UserEdit = ({...pageProps}) => {
    const dispatch = useDispatch();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const router = useRouter();
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        const pageName = "";
        const prefixName = "Editar usuario";
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
                <Link key={`myuser_Link_${index}`} href={rout.path} >
                <a className={index !== newRouts.length - 1 ? 'currenHeaderLink' : 'headerLink'}  style={{margin: "-4px 0 0 5px"}}>
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
    //estilos input error
    const [ nameErrorState, setNameErrorState ] = useState('')
    const [ passwordErrorState, setPasswordErrorState ] = useState('')
    const [ repeatPasswordErrorState, setRepeatPasswordErrorState ] = useState('')
    const [ userLanguagesErrorState, setUserLanguagesErrorState] = useState('');
    const [ userUnitSystemErrorState, setUserUnitSystemErrorState] = useState('');
    const [ nameState, setNameState ] = useState('')
    const [ passwordState, setPasswordState ] = useState('')
    const [ repeatPasswordState, setRepeatPasswordState ] = useState('')
    const [ userLanguagesState, setUserLanguagesState] = useState('');
    const [ userUnitSystemState, setUserUnitSystemState] = useState('');
    const Titulo = getText("Editar usuario",userLanguage);
    const { id } = pageProps.router.query
    const userTypes = useSelector(state => state.usuario.userTypes);
    const userLanguages = useSelector(state => state.usuario.userLanguages);
    const userUnitSystem = useSelector(state => state.usuario.userUnitSystem);
    useEffect(() => {
        //Consultar la api
        
        if(id){
            const loadUser = () => dispatch( getUserByIdAction(id) );
            loadUser()
        }
    }, [id])
    const users = useSelector(state => state.usuario.users);
    const user = useSelector(state => state.usuario.user);
    useEffect(() => {
        //Consultar la api
        if (users.length > 0) {
            const currentUser = users.find(userToSet => userToSet.id === id)
            if (currentUser) {
                //setUser(users.find(userToSet => userToSet.id === id))
                if (userUserType === 1 || userUserType === 2) {
                    const loadAccount = () => dispatch( getAccountByIdAction(currentUser.accountId) );
                loadAccount()
                }
            }
        }
        const loadUser = () => dispatch( getUserByIdAction(id) );
        loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, id])
    useEffect(() => {
        //Consultar la api
        if (user && userTypes) {
            setNameState(user.name)
            setPasswordState('')
            setRepeatPasswordState('')
            if(user.profile !== "ND"){
                const profile = JSON.parse(user.profile);
                if(profile && profile.length > 0 ){
                    const userLanguageValue = profile.find(item => item.type === "userLanguage")
                    const userUnitSystemValue = profile.find(item => item.type === "userUnitSystem")
                    if(userLanguageValue){
                        setUserLanguagesState(userLanguageValue.value);
                    }
                    if(userUnitSystemValue){
                        setUserUnitSystemState(userUnitSystemValue.value);
                    }
                }
            }
        }
    }, [user,userTypes])
    const [dataInformationComponent, setDataInformationComponent] = useState([])
    useEffect(() => {
        setDataInformationComponent([
            {prop: "userName",      fileName: getText("Nombre del Usuario",userLanguage), value: nameState,           state:nameState,          setState: setNameState,             errorState:nameErrorState,              setErrorState:setNameErrorState,            infoData: getText("El nombre de usuario debe de contener al menos 8 caracteres",userLanguage)},
            {prop: "password",      fileName: getText("Contraseña",userLanguage),         value: passwordState,       state:passwordState,      setState: setPasswordState,         errorState:passwordErrorState,          setErrorState:setPasswordErrorState,        infoData: getText("La contraseña debe ser mayor a 8 caracteres, debe contener mayúsculas, minusculas, numero y carácter especial",userLanguage),  type:"password" },
            {prop: "repeatPassword",fileName: getText("Repetir contraseña",userLanguage), value: repeatPasswordState, state:repeatPasswordState,setState: setRepeatPasswordState,   errorState:repeatPasswordErrorState,    setErrorState:setRepeatPasswordErrorState,  infoData: getText("La contraseña debe ser mayor a 8 caracteres, debe contener mayúsculas, minusculas, numero y carácter especial",userLanguage),  type:"password" },
            {prop: undefined},
            {prop: "userLanguages", fileName: getText("Idioma",userLanguage),             value: userLanguagesState, state:userLanguagesState,  setState: setUserLanguagesState,      errorState:userLanguagesErrorState,    setErrorState:setUserLanguagesErrorState,    option:userLanguages.map(type => ({value:type.id,label:type.name}) )},
            {prop: "userUnitSystem",fileName: getText("Sistema de medidas",userLanguage), value: userUnitSystemState, state:userUnitSystemState,setState: setUserUnitSystemState,     errorState:userUnitSystemErrorState,    setErrorState:setUserUnitSystemErrorState,  option:userUnitSystem.map(type => ({value:type.id,label:type.name}) )},
        ])
    }, [nameErrorState, nameState, passwordErrorState, passwordState, repeatPasswordErrorState, repeatPasswordState])
    //aramar componentes
    const editUserData = (e) => {
        e.preventDefault();
        let flagValidation = true;
        const newUser = user;
        newUser.Password = undefined;
        let errors = '';
        //newUser.name = dataInformationComponent[0].state;
        //newUser.email = dataInformationComponent[1].state;
        if(dataInformationComponent[0].state.length < 8){
            flagValidation = false;
            setDataInformationComponent(dataInformationComponent.map((dat,index) => { if (index===0){dat.errorState ='inputError';} return dat; }))
            errors += `<li>${getText('El nombre de usuario debe de contener al menos 8 caracteres',userLanguage)}</li>`;
        }
        const pssTemp1 = dataInformationComponent[1].state;
        const pssTemp2 = dataInformationComponent[2].state;
        if (pssTemp1.length > 0) {
            newUser.Password=pssTemp1;
            if (pssTemp1 !== pssTemp2) {
                flagValidation = false;
                setDataInformationComponent(dataInformationComponent.map((dat,index) => { if ( index===2 || index===3 ){dat.errorState ='inputError';} return dat; }))
                errors += `<li>${getText('Contraseñas no coinciden',userLanguage)}</li>`
            }else{
                if(!validatePassword(pssTemp1)){
                    flagValidation = false;
                    setDataInformationComponent(dataInformationComponent.map((dat,index) => { if ( index===2 || index===3 ){dat.errorState ='inputError';} return dat; }))
                    errors += `<li>${getText('Formato de contraseña invalido',userLanguage)}</li>`
                }
            }
        }
        if (flagValidation) {
            if (
                (dataInformationComponent[0].state === user.name && !newUser.Password) &&
                !dataInformationComponent[4].state && !dataInformationComponent[5].state
                ) {
                abrirAlertaCampos('error',getText('No se encontraron cambios',userLanguage))
            }else{
                newUser.name = dataInformationComponent[0].state;
                newUser.roles = user.roles.map(rol => rol)
                newUser.active = true;
                newUser.type = user.userType ? user.userType : user.type;
                console.log(newUser)
                console.log(dataInformationComponent[4].state)
                console.log(dataInformationComponent[5].state)
                const profile = [
                    {type:"userLanguage",value:dataInformationComponent[4].state},
                    {type:"userUnitSystem",value:dataInformationComponent[5].state}
                ]
                newUser.profile = JSON.stringify(profile);
                console.log(newUser)
                dispatch(editUsersAction(newUser))
                //location.reload();
            }
        }else{
            abrirAlertaCampos('error',`<ul style='list-style: unset;'>${errors}</ul> `)
        }
    }
    const userSuccess = useSelector(state => state.usuario.success);
    const userSuccessMessage = useSelector(state => state.usuario.successMessage);
    useEffect(() => {
        if(userSuccess){
            location.reload();
        }
    }, [userSuccess])
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
    const buttonGroupForm = []
    const closeComponent = (e) => {
        e.preventDefault();
        router.push(`/`);
    }
    const buttonGroupFooter = [
        {
            funcion : editUserData,
            nombre : getText("Guardar",userLanguage),
            icono : null,
            clase : "successButton"
        },{
            funcion : closeComponent,
            nombre : getText("Cerrar",userLanguage),
            icono : null,
            clase : "neutroButton"
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
                data={dataInformationComponent}
                buttonGroupPage={buttonGroupForm}
                classComponent="bodyHomeComponent"
                buttonGroupFooter={buttonGroupFooter}
                setData={setDataInformationComponent}
            />
        </>
    );
}

export default UserEdit;
