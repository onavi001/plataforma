/* eslint-disable jsx-a11y/anchor-is-valid */
import { FaBars,FaBuilding, FaTruck, FaCrosshairs, FaClipboardCheck, FaSignInAlt, FaBook, FaSignOutAlt, FaCompass, FaMapMarkedAlt, FaRoute, FaLandmark  } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { logoutAction } from "../store/actions/usuarioActions";
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import logoescudointralix from "../public/img/logoescudointralix.png";
import logoescudoblancointralix from "../public/img/logoescudoblancointralix.png";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Image from 'next/image'
//import moon from "../img/moon.png";
//import sun from "../img/sun.png";
import getText from "../config/languages";
function Menu() {
    const dispatch = useDispatch();
    const router = useRouter()
    const userLanguage = useSelector(state => state.usuario.userLanguage);
    const [ accountSectionDisplay, setAccountSectionDisplay ] = useState("none")
    const [ deviceSectionDisplay, setDeviceSectionDisplay ] = useState("none")
    const [ vehicleSectionDisplay, setVehicleSectionDisplay ] = useState("none")
    const [ zoneSectionDisplay, setZoneSectionDisplay ] = useState("none")
    const [ companiesSectionDisplay, setCompaniesSectionDisplay ] = useState("none !important")
    const [darkTheme, setDarkTheme] = useState(false);
    
    const userPermissions = useSelector(state => state.usuario.permissions);
    const user = useSelector(state => state.usuario.user);
    const [usuarioGlobal, setUsuarioGlobal] = useState(user ? user.name:'usuario');
    useEffect(() => {
        if (user && userPermissions) {
            setUsuarioGlobal(user.name)
            const userService = userPermissions.find( per => per.displayName.search("USERS") >= 0 )
            const type = user.type;
            if ( (type && type !== 3 ) || userService) {
                setAccountSectionDisplay("initial")
            }
            const deviceService = userPermissions.find( per => per.displayName.search("DEVICE") >= 0 )
            if ( type === 1  || deviceService) {
                setDeviceSectionDisplay("initial")
            }
            const vehicleService = userPermissions.find( per => per.displayName.search("DEVICE") >= 0 )
            if ( type === 1  || vehicleService) {
                setVehicleSectionDisplay("initial")
            }
            const zoneService = userPermissions.find( per => per.displayName.search("ZONE") >= 0 )
            if ( type === 1  || zoneService) {
                setZoneSectionDisplay("initial")
            }
            if(type === 1){
                setCompaniesSectionDisplay("initial")
            }
        }
    }, [user,userPermissions])
    const logOutUser = useSelector(state => state.usuario.logout);
    useEffect(() => {
        if(logOutUser){
            router.push("/login")
        }
    }, [logOutUser])
    const logout = (e) => {
        dispatch( logoutAction() )
    }
    const [ classHoverChange, setClassHoverChange ] = useState(true)
    const onClickChangeClass = (e) => {
        e.preventDefault();
        setClassHoverChange(!classHoverChange)
    }
    ///
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [menuImage,setMenuImage] = useState();
    const [menuCompany,setMenuCompany] = useState('');
    useEffect(() => {
        const image_path = sessionStorage.getItem('img_path');
        const company_name = sessionStorage.getItem('company_name');
        const img_menu = sessionStorage.getItem('img_menu');
        if(image_path !== null && img_menu !== null){
            setMenuImage(require(`../public/img/${image_path}/${img_menu}`))
        }
        setMenuCompany(company_name)
    }, [])
    return (
        <div className="menuLateral">
            <div id="sidebar" >
                {/**body de sidebar -accesos- */}
                <div className={`${classHoverChange ? "sidebar_body" : "sidebar_body sidebar_bodySecondState" }`} id="listaMenuLateral" >
                    <ul>
                        <li className="iconMenu" onClick={ e => onClickChangeClass(e)}>
                            <a>
                                <FaBars className="fa-fw"></FaBars>
                                <span><br></br></span>
                            </a>
                        </li>
                        <li className="labelMenu" style={{display: companiesSectionDisplay }}>
                            <Link href='/companies'>
                                <a>
                                    <FaLandmark className="fa-fw" ></FaLandmark>
                                    <span className="" style={{margin: "0 0 0 5px"}}>
                                        { getText("Compañias",userLanguage)}
                                    </span>
                                </a>
                            </Link>
                        </li>
                        <li className="labelMenu" style={{display: accountSectionDisplay }}>
                            <Link href='/accounts'>
                                <a>
                                    <FaBuilding className="fa-fw" ></FaBuilding>
                                    <span className="" style={{margin: "0 0 0 5px"}}>
                                        { user && user.type === 1 ? getText("Cuentas Registradas",userLanguage) : getText("Cuenta",userLanguage)}
                                    </span>
                                </a>
                            </Link>
                        </li>
                        <li></li>
                        <li className="infoliSecondState" style={{display:classHoverChange ? "none" : "initial"}} >
                            <div style={{padding: "17px 0 10px 0"}}>
                                <span className="">{getText("Flotillas",userLanguage)}</span>
                            </div>
                        </li>
                        <li></li>
                        <li className="labelMenu" style={{display: deviceSectionDisplay }}>
                            <Link href='/devices' >
                                <a>
                                    <FaCompass className="fa-fw"  ></FaCompass>
                                    <span style={{margin: "0 0 0 5px"}}>
                                        {getText("Dispositivos",userLanguage)}
                                    </span>
                                </a>
                            </Link>
                        </li>
                        <li></li>
                        <li className="labelMenu" style={{display: vehicleSectionDisplay }}>
                            <Link href='/vehicles' >
                                <a>
                                    <FaTruck className="fa-fw"  ></FaTruck>
                                    <span style={{margin: "0 0 0 5px"}}>
                                        {getText("Vehiculos",userLanguage)}
                                    </span>
                                </a>
                            </Link>
                        </li>
                        <li></li>
                        <li className="labelMenu" style={{display:zoneSectionDisplay}}>
                            <Link href='/rules' >
                                <a>
                                    <FaClipboardCheck className="fa-fw"  ></FaClipboardCheck>
                                    <span style={{margin: "0 0 0 5px"}}>
                                    {getText("Reglas",userLanguage)}
                                    </span>
                                </a>
                            </Link>
                        </li>
                        <li></li>
                        <li className="labelMenu" style={{display:zoneSectionDisplay}}>
                            <Link href='/zones' >
                                <a>
                                    <FaCrosshairs className="fa-fw"  ></FaCrosshairs>
                                    <span style={{margin: "0 0 0 5px"}}>
                                    {getText("Zonas",userLanguage)}
                                    </span>
                                </a>
                            </Link>
                        </li>
                        <li></li>
                        <li className="labelMenu" style={{display:"initial"}}>
                            <Link href='/regions' >
                                <a>
                                    <FaMapMarkedAlt className="fa-fw"  ></FaMapMarkedAlt>
                                    <span style={{margin: "0 0 0 5px"}}>
                                    {getText("Regiones",userLanguage)}
                                    </span>
                                </a>
                            </Link>
                        </li>
                        <li></li>
                        <li className="labelMenu" style={{display:"initial"}}>
                            <Link href='/travels' >
                                <a>
                                    <FaRoute className="fa-fw"  ></FaRoute>
                                    <span style={{margin: "0 0 0 5px"}}>
                                    {getText("Viajes",userLanguage)}
                                    </span>
                                </a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="bodyMenu">
                <div className="navBarMenuBody">
                    <nav id="header1">
                        <div className="navHeaderFirstChild">
                            <Link href='/home' >
                                <a>
                                    <div>
                                    
                                        <Image src={menuImage} alt="intralix" />
                                        <span className="intx_text">{menuCompany}</span>
                                    </div>
                                </a>
                            </Link>
                        </div>
                        <div className="navHeaderLastChild" style={{display: "flex"}}>
                            <div className="navHeaderLastChildFirst" style={{display:"none"}}>
                                <FaSignInAlt className="fa-fw"></FaSignInAlt><span>Log As</span>
                            </div>
                            <div className="navHeaderLastChildSecond" >
                                <FaBook className="fa-fw"></FaBook><span style={{margin: "0 0 0 5px"}} >{getText("Ayuda",userLanguage)}</span>
                            </div>
                            <div className="navHeaderLastChildThird" >
                                <div className="nameDiv">
                                    {/**intralix */}
                                    <div id="userButton" onClick={handleClick} aria-describedby={id}>
                                        <span>{usuarioGlobal}</span>
                                    </div>
                                    <Popover
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                    >
                                        <Typography sx={{ p: 2 }}>
                                            <a onClick={ e => logout(e) } className="popoverLogOut">
                                                <FaSignOutAlt className="fa-fw" />
                                                <span>
                                                    {getText("Salir",userLanguage)}
                                                </span>
                                            </a>
                                        </Typography>
                                    </Popover>
                                    {/**
                                        <a  href="#" className="darModeToggle">
                                            <span className="" onClick={() => setDarkTheme(!darkTheme)}>
                                                {darkTheme ? <img src={moon} className="" alt="moon" /> :<img src={sun} className="" alt="moon" />}
                                            </span>
                                        </a>
                                    */}
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Menu;
