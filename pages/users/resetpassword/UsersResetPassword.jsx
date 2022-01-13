import React, {useState,useEffect}from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Logotipo_592x180 from '../../../public/img/Logotipo_592x180.png'
import bg from '../../../public/img/bg.png'
import { FaLock, FaSignInAlt } from 'react-icons/fa';
import Image from 'next/image';
//import '../style/UsersResetPassword.scss'
//import '../style/login.scss'
import { abrirAlertaCampos } from "../../../config/alerts";
import { resetPasswordAction,changeStateUser } from "../../../store/actions/usuarioActions";
const UsersResetPassword = ({...pageProps}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    console.log(pageProps)
    const [token,setToken] = useState("");
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        setToken(queryParams.get('token'))
    }, [])
    const [password,setPassword] = useState("")
    const [repeatPassword,setRepeatPassword] = useState("")
    const handleConfirmPassword = (e) =>{
        e.preventDefault()
        //validate password
        if(password !== repeatPassword) {
            abrirAlertaCampos("error",`<strong>Contraseña</strong> no coincide`);
        }else if(!validatePassword(password)){
            abrirAlertaCampos("error",`Formato de <strong>Contraseña</strong> invalido </br> La contraseña debe ser mayor a 8 caracteres, debe contener mayúsculas, minusculas, numero y carácter especial`);
        }else{
            dispatch(resetPasswordAction(token,password,repeatPassword))
        }
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
    // mayor a 8 caracteres, debe contener mayúsculas, minusculas, numero y carácter especial
    useEffect(() => {
        // Accessing scss variable "--background-color"
        // and "--text-color" using plain JavaScript
        // and changing the same according to the state of "darkTheme"
        const root = document.documentElement;
        //console.log(root?.style)
        /*
        root?.style.setProperty( "--corporate_primary_color",  "#15375b" );
        root?.style.setProperty("--icon_menu_color", "#c2c7d0");
        root?.style.setProperty("--text_menu_color", "#c2c7d0");
        //button_succes
        root?.style.setProperty("--color_succes_button", "green");
        root?.style.setProperty("--text_succes_button", "#ffffff");
        //button_warning
        root?.style.setProperty("--color_warning_button", "rgba(187, 128, 9, 0.8)");
        root?.style.setProperty("--text_warning_button", "#ffffff");
        //button_error
        root?.style.setProperty("--color_error_button", "rgba(248, 81, 73, 1)");
        root?.style.setProperty("--text_error_button", "#ffffff");
        //button_default
        root?.style.setProperty("--color_default_button", "rgba(25, 118, 210, 1)");
        root?.style.setProperty("--text_default_button", "#ffffff");
        */
    }, []);
    const usuarioSuccess = useSelector(state => state.usuario.success);
    const usuarioSuccessMessage = useSelector(state => state.usuario.successMessage);
    const usuarioError = useSelector(state => state.usuario.error);
    const usuarioErrorMessage = useSelector(state => state.usuario.errorMessage);
    useEffect(() => {
        if (usuarioSuccess) {
            abrirAlertaCampos("success",usuarioSuccessMessage);
            dispatch(changeStateUser())
            router.push(`/login`)
        }
        if (usuarioError) {
            abrirAlertaCampos("error",usuarioErrorMessage);
            dispatch(changeStateUser())
        }
    }, [usuarioSuccess, usuarioError, usuarioSuccessMessage, usuarioErrorMessage])
    return (
        <div className="div1" style={{backgroundImage: `url(${bg})` }}>
                <div className="div2Reset">
                    <Image src={Logotipo_592x180} alt="intralix" />
                    <h1 className="titleReset">Restablecer la contraseña</h1>
                    <div className="div3 contentlogin">
                        <div className="divInputs">
                            <div className="divInput">
                                <input value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" pattern=".{6,}" placeholder="Contraseña" className="inputLogin"/>
                                <FaLock className="iconInputLogin" />
                            </div>
                            <div className="divInput">
                                <input value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} type="password" name="Confirmpassword" pattern=".{6,}" placeholder="Confirme contraseña" className="inputLogin"/>
                                <FaLock className="iconInputLogin" />
                            </div>
                        </div>
                        <div className="divSubmit">
                            <div className="divSubmit2">
                                <div className="divSubmitButtonLeft">
                                    <button type="button" className="buttonSubmitInicio" onClick={ e => { router.push(`/login`)} }>
                                        <span>Inicio</span>
                                    </button>
                                </div>
                                <div className="divSubmitButtonRight">
                                    <button type="button" className="buttonSubmit" onClick={ e => handleConfirmPassword(e)}>
                                        <span>Confirmar</span>
                                        <FaSignInAlt></FaSignInAlt>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}
export default UsersResetPassword;
