import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import CardComponent from "../../../Components/CardComponent";
import FormAutocompleteComponent from "../../../Components/FormAutocompleteComponent";
import { getDevicesAction, createDevicesAction } from "../../../store/actions/devicesActions";
import { getUnitsAction } from "../../../store/actions/unidadesActions";
import { getGpsModelsAction } from "../../../store/actions/usuarioActions";
import { abrirAlertaCampos } from "../../../config/alerts";

import SubmitCreateCompany from "./SubmitCreateCompany";
import getText from "../../../config/languages";
import FullComponent from "../../../Components/FullComponent";
import { useRouter } from 'next/router';
import Link from 'next/link';
const CreateCompany = () => {
    const dispatch = useDispatch();
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const Titulo = getText("Crear dispositivo",userLanguage)
    //rutas
    const [titleRouts,setTitleRouts] = useState([]);
    useEffect(() => {
        const pathname = window.location.pathname;
        const pageName = "";
        const prefixName = "Registrar compañia";
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
                <Link key={`DevicesCreate_Link_${index}`} href={rout.path} >
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
    const router = useRouter();
    
    const closeForm = (e) => {
        e.preventDefault();
        router.push("/companies");
    }
    
    const buttonGroupFooter = [
        {
            funcion : closeForm,
            nombre : getText("Cancelar",userLanguage),
            icono : null,
            clase : "intralixButton"
        },{
            funcion : ()=>{},
            nombre : getText("Registrar Dispositivo",userLanguage),
            icono : null,
            clase : "intralixButton"
        }
    ]
    const onSubmit = async (values) =>{
        console.log(values)
    }
    return (
        <>
            <FullComponent
                Titulo={titleRouts}
            />
            <SubmitCreateCompany onSubmit={onSubmit} />
            {/*<CardComponent
                Titulo={Titulo}
                Body={FormAutocompleteComponent}
                classComponent="bodyDeviceCreateComponent"
                data={dataInformationComponent}
                setData={setDataInformationComponent}
                buttonGroupFooter={buttonGroupFooter}
            />*/}
        </>
    );
}
export default CreateCompany;