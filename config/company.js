export const companies = [
    {
        id:"000-001",
        url:"localhost:3000",
        name:"intralix",
        img_path:"intralix",
        company_name:"Intralix",
        //
        img_login:"login.png",
        img_menu:"menu.png",
        img_favicon:"favicon.ico",
        corporate_primary_color:"#15375b",
        icon_menu_color:"#c2c7d0",
        text_menu_color:"#c2c7d0",
        color_succes_button:"rgb(46, 125, 50)",
        text_succes_button:"rgb(255,255,255)",
        color_warning_button:"rgb(187, 128, 9)",
        text_warning_button:"rgb(255,255,255)",
        color_error_button:"rgb(211, 47, 47)",
        text_error_button:"rgb(255,255,255)",
        color_default_button:"rgb(25, 118, 210)",
        text_default_button:"rgb(255,255,255)",
        color_neutro_button:"rgb(128,128,128)",
        text_neutro_button:"rgb(0,0,0)"
    },{
        id:"000-002",
        url:"localhost:4000",
        name:"localhost",
        corporate_primary_color:"#000000",
        icon_menu_color:"#FFF",
        text_menu_color:"#FFF",
        img_path:"localhost",
        company_name:"localhost",
        img_login:"login.png",
        img_menu:"menu.png",
        img_favicon:"favicon.png",
        color_succes_button:"rgb(46, 125, 50)",
        text_succes_button:"rgb(255,255,255)",
        color_warning_button:"rgb(187, 128, 9)",
        text_warning_button:"rgb(255,255,255)",
        color_error_button:"rgb(211, 47, 47)",
        text_error_button:"rgb(255,255,255)",
        color_default_button:"rgb(25, 118, 210)",
        text_default_button:"rgb(255,255,255)",
        color_neutro_button:"rgb(128,128,128)",
        text_neutro_button:"rgb(0,0,0)"
    },{
        id:"000-003",
        url:"localhost:5000",
        name:"BIMBO",
        corporate_primary_color:"#ee353a",
        icon_menu_color:"#FFF",
        text_menu_color:"#FFF",
        img_path:"BIMBO",
        company_name:"BIMBO",
        img_login:"login.png",
        img_menu:"menu.png",
        img_favicon:"favicon.ico",
        color_succes_button:"rgb(46, 125, 50)",
        text_succes_button:"rgb(255,255,255)",
        color_warning_button:"rgb(187, 128, 9)",
        text_warning_button:"rgb(255,255,255)",
        color_error_button:"rgb(211, 47, 47)",
        text_error_button:"rgb(255,255,255)",
        color_default_button:"rgb(25, 118, 210)",
        text_default_button:"rgb(255,255,255)",
        color_neutro_button:"rgb(128,128,128)",
        text_neutro_button:"rgb(0,0,0)"
    }
];
export default function selectCompany(url){
    const company_return = companies.find(company => company.url === url);
    if(company_return){
        return company_return;
    }else{
        return companies[0];
    }
};