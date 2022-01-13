import { Provider } from "react-redux";
import React, {useEffect,useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";
import '../styles/login.scss'
import '../styles/menu.scss';
import '../styles/cardcomponent.scss'
import "../styles/table.scss";
import "../styles/home.scss";
import "../styles/table.scss";
import "../styles/account.scss";
import '../styles/accountCreate.scss';
import '../styles/roles.scss';
import '../styles/user.scss';
import '../styles/devices.scss';
import '../styles/vehicles.scss';
import '../styles/rules.scss';
import '../styles/zone.scss';
import '../styles/regions.scss';
import '../styles/travels.scss';
import '../styles/BasicFormComponent.scss';
import '../styles/UsersResetPassword.scss'
import PrivateRoute from "../Components/PrivateRoute.jsx";
import Menu from "../Components/Menu.jsx";
import { useRouter } from 'next/router';
import selectCompany from "../config/company";
import Head from 'next/head'
function MyApp({ Component, ...pageProps }) {
  const router = useRouter()
  const [companyState,setCompanyState] = useState();
  useEffect(() => {
    console.log(window.location.host)
    const curretn_URL = window.location.host;
    const company_config = selectCompany(curretn_URL);
    setCompanyState(company_config)
    const root = document.documentElement;
    //root?.style.setProperty("--corporate_primary_color",  "#15375b" );
    root?.style.setProperty("--corporate_primary_color",  company_config.corporate_primary_color );
    root?.style.setProperty("--icon_menu_color",company_config.icon_menu_color);
    root?.style.setProperty("--text_menu_color",company_config.text_menu_color);
    //button_succes
    root?.style.setProperty("--color_succes_button",company_config.color_succes_button);
    root?.style.setProperty("--text_succes_button",company_config.text_succes_button);
    //button_warning
    root?.style.setProperty("--color_warning_button",company_config.color_warning_button);
    root?.style.setProperty("--text_warning_button",company_config.text_warning_button);
    //button_error
    root?.style.setProperty("--color_error_button",company_config.color_error_button);
    root?.style.setProperty("--text_error_button",company_config.text_error_button);
    //button_default
    root?.style.setProperty("--color_default_button",company_config.color_default_button);
    root?.style.setProperty("--text_default_button",company_config.text_default_button);
    //button_neutro
    root?.style.setProperty("--color_neutro_button",company_config.color_neutro_button);
    root?.style.setProperty("--text_neutro_button",company_config.text_neutro_button);
    //images
    sessionStorage.setItem('img_path', company_config.img_path);
    sessionStorage.setItem('company_name', company_config.company_name);
    sessionStorage.setItem('img_login', company_config.img_login);
    sessionStorage.setItem('img_menu', company_config.img_menu);
  }, [])
  return (
    <Provider store={store}>
      <Head>
        {
          companyState ?
            <link rel="shortcut icon" href={`/img/${companyState.img_path}/${companyState.img_favicon}`} />
          :
            null
        }
      </Head>
      {
        router.asPath !== '/login' && router.route !== "/users/resetpassword"?
          <>
            <Menu/>
            <PrivateRoute Component={Component} {...pageProps}/>
          </>
        :
        <>
          <Component/>
        </>
      }
    </Provider>
  )
}

export default MyApp
