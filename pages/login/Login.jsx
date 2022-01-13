import React, {useState,useEffect}from 'react';
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router'
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import Logotipo_592x180 from '../../public/img/Logotipo_592x180.png'
import ConfirmDialogComponent from "../../Components/ConfirmDialogComponent";
import { loginAction, forgotPasswordAction, changeStateUser } from "../../store/actions/usuarioActions";
import { abrirAlertaCampos } from "../../config/alerts";
import { fileMesagge } from "../../config/message";
import Image from 'next/image';
import selectCompany from "../../config/company";
const Login = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [mensajeError,setMensajeError] = useState("")
    const [showError,setShowError] = useState(false)
    const login = useSelector(state => state.usuario.login);
    const [open,setOpen]= useState(false);
    const TituloDialog = "Recuperar contraseña"
    const [resetEmail, setResetEmail] = useState("");
    const InputDialog = () => {
        return (<TextField autoFocus margin="dense" id="name" label="Correo" type="email" fullWidth variant="standard" value={resetEmail} onChange={ e => setResetEmail(e.target.value)} />)
    }
    const handleSend = () => {
        dispatch(forgotPasswordAction(resetEmail))
    }
    //
    const usuarioSuccess = useSelector(state => state.usuario.success);
    const usuarioSuccessMessage = useSelector(state => state.usuario.successMessage);
    const usuarioError = useSelector(state => state.usuario.error);
    const usuarioErrorMessage = useSelector(state => state.usuario.errorMessage);
    useEffect(() => {
        if (usuarioSuccess) {
            abrirAlertaCampos("success",usuarioSuccessMessage);
            //dispatch(changeState())
            setOpen(false)
        }
        if (usuarioError) {
            //abrirAlertaCampos("error",usuarioErrorMessage);
            setOpen(false)
            setShowError(true)
            const message = fileMesagge("",usuarioErrorMessage);
            setMensajeError(message)
            dispatch(changeStateUser())
        }
    }, [usuarioSuccess, usuarioError, usuarioSuccessMessage, usuarioErrorMessage, dispatch])
    //
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localStorage_login,setlocalStorage_login] = useState(undefined)
    useEffect(() => {
        setlocalStorage_login(sessionStorage.getItem('loggedIn'))
    }, [])
    const [imageLogin,setImageLogin] = useState()
    console.log(setImageLogin);
    useEffect(() => {
        const curretn_URL = window.location.host;
        const company_config = selectCompany(curretn_URL);
        if(company_config.img_path !== null && company_config.img_login !== null){
            setImageLogin(require(`../../public/img/${company_config.img_path}/${company_config.img_login}`));
        }
    }, []);
    const validateFiles = () => {
        if (!validateEmail(email)) {
            setShowError(true);
            const message = fileMesagge("del correo","invalid");
            setMensajeError(message);
            //abrirAlertaCampos('error',"Formato incorrecto del correo")
            return false;
        }
        if (password.length <= 3) {
            setShowError(true)
            const message = fileMesagge("de la contraseña","invalid");
            setMensajeError(message);
            //abrirAlertaCampos('error',"Contraseña invalida")
            return false;
        }
        return true;
    }
    const handleSubmit = (e) => {
        const validate = validateFiles();
        if (validate) {
            dispatch( loginAction(email,password) );
        }
    }
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    if (localStorage_login === 'true' || login) {
        //return <Redirect to='/' />
        router.push('/')
    }
    return (
        <>
            <div className="div1">
                <div className="div2">
                    { imageLogin ? <Image src={imageLogin} alt="intralix" /> : null }
                    {/*<div className="divImage" ></div>*/}
                    <div className="div3 contentlogin">
                        <div className="divInputs" style={{paddingBottom:"0px"}}>
                            <div className="notification" style={{display: showError ? "block" : "none" }}>
                                <div className="divStaticMessage">
                                </div>
                                <div className="divDinamicMessage">
                                    {mensajeError}
                                </div>
                            </div>
                            <div className="divInput">
                                <input type="email" name="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} className="inputLogin" />
                                <FaEnvelope className="iconInputLogin" />
                            </div>
                            <div className="divInput" style={{marginBottom:"0px"}}>
                                <input type="password" name="password" pattern=".{6,}" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="inputLogin" />
                                <FaLock className="iconInputLogin" />
                            </div>
                        </div>
                        <div className="divSubmit">
                            <div className="divSubmit2">
                                <div className="divSubmitButtonLeft"></div>
                                <div className="divSubmitButtonRight">
                                    <button onClick={ e => handleSubmit(e) } type="button" className="buttonSubmit">
                                        <span>Login</span>
                                        <FaSignInAlt size={20} ></FaSignInAlt>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="divide-y">
                        <div style={{borderTop: "2px solid rgba(0, 0, 0, .1)"}}></div>
                        <div>
                            <div className="" onClick={ e => setOpen(true)}>
                                <div className="divSubmitButtonLeft">
                                    <div className="divReset2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                        </svg>
                                        <span>Recuperar contraseña</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmDialogComponent
                open={open}
                setOpen={setOpen}
                TituloDialog={TituloDialog}
                Body={InputDialog}
                actionFunction={handleSend}
            />
        </>
    );
}
export default Login;
