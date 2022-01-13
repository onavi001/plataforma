import React, {useState} from 'react'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
//import { TextField, Checkbox, Radio, Select } from 'final-form-material-ui';
//import {TextField,Checkboxes,Radios,Select,DatePicker,TimePicker,} from 'mui-rff';
//import {MenuItem} from '@material-ui/core';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import { ColorPicker, ColorPalette } from 'material-ui-color';
//import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import UploadFile from "./UploadFile";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
//#region
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';


//#endregion
const SubmitCreateCompany = ({onSubmit}) => {
    const initialValues={
        color_succes_button:"rgb(46, 125, 50)",
        text_succes_button:"rgb(255,255,255)",
        color_warning_button:"rgb(187, 128, 9)",
        text_warning_button:"rgb(255,255,255)",
        color_error_button:"rgb(211, 47, 47)",
        text_error_button:"rgb(255,255,255)",
        color_default_button:"rgb(25, 118, 210)",
        text_default_button:"rgb(255,255,255)",
        color_neutro_button:"rgb(128,128,128)",
        text_neutro_button:"rgb(255,255,255)",
    }
    const [imageLogin,setImageLogin]=useState();
    const [imageMenu,setImageMenu]=useState();
    const [imageFavicon,setImageFavicon]=useState();
    /**
     * *validate
     * *validador de formulario
     * @values valores del formulario
     */
    const validate = async (values) => {
        const errors = {};
        console.log("values")
        console.log(values)
        if (!values.code) {
            errors.code = 'Requerido';
        }
        if (!values.url) {
            errors.url = 'Requerido';
        }
        if (!values.companyName) {
            errors.companyName = 'Requerido';
        }
        //#region colores primarios
        if (!values.primary_color) {
            errors.primary_color = 'Requerido';
        }
        if (!values.icon_color) {
            errors.icon_color = 'Requerido';
        }
        if (!values.text_color) {
            errors.text_color = 'Requerido';
        }
        //#endregion
        //#region colores botones
        if(!values.color_succes_button){
            errors.color_succes_button = 'Requerido';
        }
        if(!values.text_succes_button){
            errors.text_succes_button = 'Requerido';
        }
        if(!values.color_warning_button){
            errors.color_warning_button = 'Requerido';
        }
        if(!values.text_warning_button){
            errors.text_warning_button = 'Requerido';
        }
        if(!values.color_error_button){
            errors.color_error_button = 'Requerido';
        }
        if(!values.text_error_button){
            errors.text_error_button = 'Requerido';
        }
        if(!values.color_default_button){
            errors.color_default_button = 'Requerido';
        }
        if(!values.text_default_button){
            errors.text_default_button = 'Requerido';
        }
        if(!values.color_neutro_button){
            errors.color_neutro_button = 'Requerido';
        }
        if(!values.text_neutro_button){
            errors.text_neutro_button = 'Requerido';
        }
        //#endregion
        if (!values.img_login) {
            errors.img_login = 'Requerido';
        }else{
            console.log(values.img_login.name)
        }
        if (!values.img_menu) {
            errors.img_menu = 'Requerido';
        }
        if (!values.img_favicon) {
            errors.img_favicon = 'Requerido';
        }
        return errors;
    };
    const handleChangeImageLogin = (e,functionProp) => {
        functionProp(e)
        console.log(e.target.files[0])
        setImageLogin(e.target.files[0])
    }
    const handleChangeImageMenu = (e,functionProp) => {
        functionProp(e)
        console.log(e.target.files[0])
        setImageMenu(e.target.files[0])
    }
    const handleChangeImageFavicon = (e,functionProp) => {
        functionProp(e)
        console.log(e.target.files[0])
        setImageFavicon(e.target.files[0])
    }
    const [files,setFiles]=useState()
    console.log(files)
    return (
        <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
            render={({ handleSubmit, reset, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit} noValidate>
                    <Paper style={{ padding: 16 }}>
                    <Grid container alignItems="flex-start" spacing={2}>
                        <Grid key={`Create_Form_Grid_Name`} item xs={12} sm={4} md={4} lg={4} xl={4} >
                            <Field
                                required
                                name="code"
                                label="Codigo"
                                variant="standard"
                            >
                                {props => (
                                    <>
                                        <TextField
                                            className={props.meta.error && props.meta.touched ? "textError":""}
                                            variant="standard"
                                            label="Codigo"
                                            fullWidth
                                            {...props.input}
                                        />
                                        {
                                            props.meta.error && props.meta.touched &&
                                            <p className="regionZoneError" >{props.meta.error}</p>
                                        }
                                    </>
                                )}
                            </Field>
                        </Grid>
                        <Grid key={`Create_Form_Grid_Name`} item xs={12} sm={4} md={4} lg={4} xl={4} >
                            <Field
                                required
                                name="url"
                                label="URL"
                                variant="standard"
                            >
                                {props => (
                                    <>
                                        <TextField
                                            className={props.meta.error && props.meta.touched ? "textError":""}
                                            variant="standard"
                                            label="URL"
                                            fullWidth
                                            {...props.input}
                                        />
                                        {
                                            props.meta.error && props.meta.touched &&
                                            <p className="regionZoneError" >{props.meta.error}</p>
                                        }
                                    </>
                                )}
                            </Field>
                        </Grid>
                        <Grid key={`Create_Form_Grid_Name`} item xs={12} sm={4} md={4} lg={4} xl={4} >
                            <Field
                                required
                                name="companyName"
                                label="Nombre de compañia"
                                variant="standard"
                            >
                                {props => (
                                    <>
                                        <TextField
                                            className={props.meta.error && props.meta.touched ? "textError":""}
                                            variant="standard"
                                            label="Nombre de compañia"
                                            fullWidth
                                            {...props.input}
                                        />
                                        {
                                            props.meta.error && props.meta.touched &&
                                            <p className="regionZoneError" >{props.meta.error}</p>
                                        }
                                    </>
                                )}
                            </Field>
                        </Grid>
                        {
                            //#region colores primarios
                            <>
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                    <Field
                                        required
                                        name="primary_color"
                                        label="Color" >
                                    {props => (
                                        <>
                                            <label>Color primario</label>
                                            <ColorPicker {...props.input}/>
                                            {
                                                props.meta.error &&
                                                <p className="regionZoneError" >{props.meta.error}</p>
                                            }
                                        </>
                                    )}
                                    </Field>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                    <Field
                                        required
                                        name="icon_color"
                                        label="Color"
                                    >
                                    {props => (
                                        <>
                                            <label>Color iconos menu</label>
                                            <ColorPicker {...props.input}/>
                                            {
                                                props.meta.error &&
                                                <p className="regionZoneError" >{props.meta.error}</p>
                                            }
                                        </>
                                    )}
                                    </Field>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                    <Field
                                        required
                                        name="text_color"
                                        label="Color" >
                                    {props => (
                                        <>
                                            <label>Color texto</label>
                                            <ColorPicker {...props.input}/>
                                            {
                                                props.meta.error &&
                                                <p className="regionZoneError" >{props.meta.error}</p>
                                            }
                                        </>
                                    )}
                                    </Field>
                                </Grid>
                            </>
                            //#endregion
                        }
                        {
                            //#region colores botones
                            <Grid container xs={12} sm={12} md={12} lg={12} xl={12} alignItems="flex-start" spacing={2} style={{ marginTop: 5, marginLeft:15, marginRight:5 }}>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography>Botones</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container xs={12} sm={12} md={12} lg={12} xl={12} alignItems="flex-start" spacing={2} style={{ marginTop: 5, marginLeft:5, marginRight:5 }}>
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                                <Field name="color_succes_button" label="Color" >
                                                {props => (
                                                    <>
                                                        <label>Color boton exito</label>
                                                        <ColorPicker {...props.input}/>
                                                        {
                                                            props.meta.error &&
                                                            <p className="regionZoneError" >{props.meta.error}</p>
                                                        }
                                                    </>
                                                )}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                                <Field name="text_succes_button" label="Color" >
                                                {props => (
                                                    <>
                                                        <label>Color texto exito</label>
                                                        <ColorPicker {...props.input}/>
                                                        {
                                                            props.meta.error &&
                                                            <p className="regionZoneError" >{props.meta.error}</p>
                                                        }
                                                    </>
                                                )}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                                <Field name="color_warning_button" label="Color" >
                                                {props => (
                                                    <>
                                                        <label>Color boton warning</label>
                                                        <ColorPicker {...props.input}/>
                                                        {
                                                            props.meta.error &&
                                                            <p className="regionZoneError" >{props.meta.error}</p>
                                                        }
                                                    </>
                                                )}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                                <Field name="text_warning_button" label="Color" >
                                                {props => (
                                                    <>
                                                        <label>Color texto warning</label>
                                                        <ColorPicker {...props.input}/>
                                                        {
                                                            props.meta.error &&
                                                            <p className="regionZoneError" >{props.meta.error}</p>
                                                        }
                                                    </>
                                                )}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                                <Field name="color_error_button" label="Color" >
                                                {props => (
                                                    <>
                                                        <label>Color boton error</label>
                                                        <ColorPicker {...props.input}/>
                                                        {
                                                            props.meta.error &&
                                                            <p className="regionZoneError" >{props.meta.error}</p>
                                                        }
                                                    </>
                                                )}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                                <Field name="text_error_button" label="Color" >
                                                {props => (
                                                    <>
                                                        <label>Color texto error</label>
                                                        <ColorPicker {...props.input}/>
                                                        {
                                                            props.meta.error &&
                                                            <p className="regionZoneError" >{props.meta.error}</p>
                                                        }
                                                    </>
                                                )}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                                <Field name="color_default_button" label="Color" >
                                                {props => (
                                                    <>
                                                        <label>Color boton info</label>
                                                        <ColorPicker {...props.input}/>
                                                        {
                                                            props.meta.error &&
                                                            <p className="regionZoneError" >{props.meta.error}</p>
                                                        }
                                                    </>
                                                )}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                                <Field name="text_default_button" label="Color" >
                                                {props => (
                                                    <>
                                                        <label>Color texto info</label>
                                                        <ColorPicker {...props.input}/>
                                                        {
                                                            props.meta.error &&
                                                            <p className="regionZoneError" >{props.meta.error}</p>
                                                        }
                                                    </>
                                                )}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                                <Field name="color_neutro_button" label="Color" >
                                                {props => (
                                                    <>
                                                        <label>Color boton neutro</label>
                                                        <ColorPicker {...props.input}/>
                                                        {
                                                            props.meta.error &&
                                                            <p className="regionZoneError" >{props.meta.error}</p>
                                                        }
                                                    </>
                                                )}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                                                <Field name="text_neutro_button" label="Color" >
                                                {props => (
                                                    <>
                                                        <label>Color texto neutro</label>
                                                        <ColorPicker {...props.input}/>
                                                        {
                                                            props.meta.error &&
                                                            <p className="regionZoneError" >{props.meta.error}</p>
                                                        }
                                                    </>
                                                )}
                                                </Field>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                            //#endregion
                        }
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                            <Field name="img_login" type="file" >
                            {props => (
                                <>
                                    <label>Imagen login</label>
                                    <FilePond
                                        //ref={ref => this.pond = ref}
                                        {...props.input}
                                        //files={files}
                                        allowMultiple={false}
                                        //oninit={() => this.handleInit() }
                                        onupdatefiles={fileItems => {
                                            // Set currently active file objects to this.state
                                            props.input.onChange(fileItems[0].file)
                                            //setFiles(fileItems.map(fileItem => fileItem.file))
                                        }}
                                        {...props.input}
                                    >
                                    </FilePond>
                                    {
                                        props.meta.error && props.meta.touched &&
                                        <p className="regionZoneError" >{props.meta.error}</p>
                                    }
                                </>
                            )}
                            </Field>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                            <Field name="img_menu">
                            {props => (
                                <>
                                    <label>Imagen menu</label>
                                    <FilePond
                                        //ref={ref => this.pond = ref}
                                        {...props.input}
                                        //files={files}
                                        allowMultiple={false}
                                        //oninit={() => this.handleInit() }
                                        onupdatefiles={fileItems => {
                                            // Set currently active file objects to this.state
                                            props.input.onChange(fileItems[0].file)
                                            //setFiles(fileItems.map(fileItem => fileItem.file))
                                        }}
                                        {...props.input}
                                    >
                                    </FilePond>
                                    {
                                        props.meta.error && props.meta.touched &&
                                        <p className="regionZoneError" >{props.meta.error}</p>
                                    }
                                </>
                            )}
                            </Field>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                            <Field name="img_favicon">
                            {props => (
                                <>
                                    <label>Favicon</label>
                                    <FilePond
                                        //ref={ref => this.pond = ref}
                                        {...props.input}
                                        //files={files}
                                        allowMultiple={false}
                                        //oninit={() => this.handleInit() }
                                        onupdatefiles={fileItems => {
                                            // Set currently active file objects to this.state
                                            props.input.onChange(fileItems[0].file)
                                            //setFiles(fileItems.map(fileItem => fileItem.file))
                                        }}
                                        {...props.input}
                                    >
                                    </FilePond>
                                    {
                                        props.meta.error && props.meta.touched &&
                                        <p className="regionZoneError" >{props.meta.error}</p>
                                    }
                                </>
                            )}
                            </Field>
                        </Grid>
                        <Grid container xs={12} sm={4} md={4} lg={4} xl={4} >
                            <Grid  style={{ marginTop: 16, marginLeft:15, marginRight:5 }}>
                                <Button
                                    type="button"
                                    variant="contained"
                                    onClick={reset}
                                    disabled={submitting || pristine}
                                    className={submitting || pristine ?"submitDisable":""}
                                >
                                    Limpiar
                                </Button>
                            </Grid>
                            <Grid  style={{ marginTop: 16, marginLeft:15, marginRight:15 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    //disabled={submitting}
                                    disabled={ submitting || pristine }
                                    className={submitting || pristine ?"submitDisable":""}
                                >
                                    Guardar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    </Paper>
                </form>
            )}
        />
    )
}


export default SubmitCreateCompany

