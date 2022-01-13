import CardComponent from "../../Components/CardComponent";
import FullComponent from "../../Components/FullComponent";
import InformationComponent from "../../Components/InformationComponent";
import { useDispatch, useSelector } from 'react-redux'
import { getUserAction } from "../../store/actions/usuarioActions";
import { getAccountByIdAction } from "../../store/actions/accountsActions";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link'
import getText from "../../config/languages";
const Home = () => {
    const dispatch = useDispatch();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const router = useRouter()
    const Titulo = getText("Información del usuario",userLanguage)
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        //ruta
        const pathname = window.location.pathname;
        const pageName = "";
        const prefixName = "Inicio";
        const flagPrincipal=true;
        if(flagPrincipal){
            sessionStorage.setItem('rout', JSON.stringify([]));
        }
        let routs = [];
        const valueRoutStorage = JSON.parse(sessionStorage.getItem('rout'));
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
        const newRouts = [];
        let index = 0;
        do {
            const rout = routs[index];
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
                <Link key={index} to={rout.path} href="#" className={index !== newRouts.length - 1 ? 'currenHeaderLink' : 'headerLink'} >
                    <a style={{margin: "-4px 0 0 5px"}} className={index !== newRouts.length - 1 ? 'currenHeaderLink' : 'headerLink'} >
                        {index > 0 ? ' / ':null}
                        {`${getText(rout.prefix,userLanguage)} ${rout.name?':'+rout.name:''}`}
                    </a>
                </Link>
            ))
            }
        </span>
        ))
    }, [])
    const user = useSelector(state => state.usuario.user);
    useEffect(() => {
        if (!user) {
        const cargarUsuario = () => dispatch( getUserAction() );
        cargarUsuario()
        }
    },[dispatch, user])
    const userUserType = useSelector(state => state.usuario.userType);
    const userTypes = useSelector(state => state.usuario.userTypes);
    //const users = useSelector(state => state.usuario.users);
    const account = useSelector(state => state.accounts.account);
    useEffect(() => {
        if (user && !account && (userUserType === 1 || userUserType === 2 )) {
            const cargarCuenta = () => dispatch( getAccountByIdAction(user.accountId) );
            cargarCuenta()
        }
    },[account, dispatch, user, userUserType])
    const [dataInformationComponent, setDataInformationComponent] = useState([])
    useEffect(() => {
        if (account || user) {
            let tempObject = Object.keys(user).map((prop) => {
                if(typeof user[prop] === 'string' || typeof user[prop] === 'number' || typeof user[prop] === 'boolean') {
                    let newObjectUserField = {};
                    if (prop === "name")
                        newObjectUserField = {prop:"name", fileName:getText("Nombre",userLanguage),value:user[prop]}
                    else if (prop === "email")
                        newObjectUserField = {prop:"email", fileName:getText("Correo",userLanguage),value:user[prop]}
                    else if (prop === "accountId" && account)
                        newObjectUserField = {prop:"accountId", fileName:getText("Cuenta",userLanguage),value: (account ? account.name : 'ND') }
                    else if (prop === "profile"){
                        if(user.profile !== "ND"){
                            const profileN = JSON.parse(user.profile);
                            console.log(profileN)
                            if(profileN && profileN.length > 0){
                                const labelProfile = [];
                                const userLanguageValue = profileN.find(item => item.type === "userLanguage")
                                const userUnitSystemValue = profileN.find(item => item.type === "userUnitSystem")
                                if(userLanguageValue){
                                    labelProfile.push(<>{`${getText("Idioma",userLanguage)} : ${userLanguageValue.value}`}<br/></>);
                                }
                                if(userUnitSystemValue){
                                    //setUserUnitSystemState(userUnitSystemValue.value);
                                    //labelProfile += `\n ${getText("Sistema de medidas",userLanguage)} : ${userUnitSystemValue.value}`;
                                    labelProfile.push(<>{`${getText("Sistema de medidas",userLanguage)} : ${userUnitSystemValue.value}`}</>);
                                }
                                newObjectUserField = {prop:"profile", fileName:getText("Perfil",userLanguage),value:labelProfile}
                            }else{
                                newObjectUserField = {prop:"profile", fileName:getText("Perfil",userLanguage),value:""}
                            }
                        }else{
                            newObjectUserField = {prop:"profile", fileName:getText("Perfil",userLanguage),value:""}
                        }
                    }
                    else if (prop === "type")
                        newObjectUserField = {prop:"type", fileName:getText("Tipo",userLanguage),value: userTypes.find(type => type.id === user[prop]) ? userTypes.find(type => type.id === user[prop]).name : user[prop] }
                    else
                        newObjectUserField = null
                    return newObjectUserField
                }else{
                    return null
                }
            })
            setDataInformationComponent(tempObject.filter(file => file !== null))
        }
    }, [account, user, userTypes])
    const openEditUserWindow = (e) => {
        e.preventDefault();
        router.push(`/myuser/${user.id}`)
    }
    const buttonGroupFooter = [
        {
            funcion : openEditUserWindow,
            nombre : getText("Editar Información",userLanguage),
            icono : <FaEdit style={{margin: "0 10px 0 0"}}/>,
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
                Body={InformationComponent}
                classComponent="bodyHomeComponent"
                data={dataInformationComponent}
                buttonGroupFooter={buttonGroupFooter}
            />
        </>
    );
}

export default Home;
