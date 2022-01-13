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
const { parse } = require('wkt');
const palette = {
    '#000000': '#000000',
    '#009933': '#009933',
    '#00cccc': '#00cccc',
    '#0066cc': '#0066cc',
    '#0000ff': '#0000ff',
    '#660099': '#660099',
    '#ff0000': '#ff0000',
    '#ff6600': '#ff6600',
    '#ffcc00': '#ffcc00',
    '#ffff00': '#ffff00',
};
const SubmitFormUpdateComponent = ({onSubmit,initialValues,
    regions=[],
    zoneTypes=[],
    handleChangeTypeInput=()=>{},
    proZones=[],
    zoneActions=[],
    handleChangeColor,
    cardZone,
    searchZone,
    arrayPath,
    setArrayPath,
    getCenterAndZoomPath,
    color,
    regionZone,
    setRegionZone,
}) => {
    //const [color,setColor] = useState("")
    const [ createParentZonesSelect, setCreateParentZonesSelect] = useState(false);
    //const [regionZone, setRegionZone] = useState(null);
    const regionRef = React.useRef(undefined);
    const [displayErrorRegion,setDisplayErrorRegion] = useState('none');
    const filter = createFilterOptions();
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const filterZones = (zonesToFilter) =>{
        return zonesToFilter.filter(zon => zon.name.search(searchZone) !== -1)
    }
    /**
     * *validate
     * *validador de formulario
     * @values valores del formulario
     */
    const validate = (values) => {
        const errors = {};
        console.log("values")
        console.log(values)
        //setCreateParentZonesSelect(false)
        if (!values.classificationName) {
            errors.classificationName = 'Requerido';
        }
        if (!values.type) {
            errors.type = 'Requerido';
        }else{
            const globalZ = zoneTypes.find( ty => ty.id === values.type)
            if(!values.parentZone){
                if(!globalZ.parent){
                    errors.parentZone = 'Requerido';
                    setCreateParentZonesSelect(true)
                }
            }else{
                const parentZoneC = filterZones(cardZone).find(pz => pz.id === values.parentZone)
                if(parentZoneC && arrayPath && !arrayPath.find(path => path.id === parentZoneC.id )) {
                    const pathParse = parse(parentZoneC.polygonWKT);
                    const formatPath = pathParse.coordinates[0].map(coor => {
                        return { lat:coor[1],lng:coor[0] }
                    })
                    formatPath.pop();
                    //funcion
                    getCenterAndZoomPath(formatPath,pathParse)
                    setArrayPath(
                        [
                            ...arrayPath,
                            {
                                path:formatPath,
                                id:parentZoneC.id,
                                color:parentZoneC.color,
                                name:parentZoneC.name
                            }
                        ]
                    )
                }
                //handleSeeZoneTempo(parentZoneC)
            }
            if(globalZ.parent){
                setCreateParentZonesSelect(false)
            }
        }
        if (!values.action) {
            if(values.action !== 0){
                errors.action = 'Requerido'; 
            }
        }
        if(!regionZone && regionRef.current) {
            regionRef.current.classList.add('MuiInput-underline');
            regionRef.current.classList.add('Mui-error');
            regionRef.current.classList.add('autocompleteError');
            setDisplayErrorRegion('initial')
        }
        return errors;
    };
    return (
        <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
            render={({ handleSubmit, reset, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit} noValidate>
                <Paper style={{ padding: 16 }}>
                    <Grid container alignItems="flex-start" spacing={2}>
                        <Grid key={`Create_Form_Grid_Name`} item xs={12}>
                            <Field
                                required
                                name="classificationName"
                                label="Nombre"
                                variant="standard"
                            >
                                {props => (
                                    <>
                                        <TextField
                                            className={props.meta.error && props.meta.touched ? "textError":""}
                                            variant="standard"
                                            label="Nombre"
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
                        <Grid item xs={12}>
                            <Field
                                fullWidth
                                name="description"
                                label="Descripción"
                                variant="standard"
                            >
                                {props => (
                                    <>
                                        <TextField
                                            label="Descripción"
                                            variant="standard"
                                            fullWidth
                                            {...props.input}
                                        />
                                    </>
                                )}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <Field required name="type" >
                                {props => (
                                    <>
                                        <InputLabel className={props.meta.error && props.meta.touched ? "textError":""} >Tipo</InputLabel>
                                        <Select
                                            fullWidth
                                            name="type"
                                            label="Tipo"
                                            onClick={ handleChangeTypeInput }
                                            variant="standard"
                                            {...props.input}
                                        >
                                            {
                                                zoneTypes.map((type,key) => (
                                                    <MenuItem style={{display: "list-item"}} key={key} value={type.id}>{type.name}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        {
                                            props.meta.error && props.meta.touched &&
                                            <p className="regionZoneError" >{props.meta.error}</p>
                                        }
                                    </>
                                )}
                            </Field>
                        </Grid>
                        <Grid item xs={12} style={{display: createParentZonesSelect ? 'initial':'none'}}>
                            <Field fullWidth required name="parentZone" label="Zona padre">
                                {props => (
                                    <>
                                        <InputLabel className={props.meta.error && props.meta.touched ? "textError":""} >Zona padre</InputLabel>
                                        <Select
                                            fullWidth
                                            required
                                            name="parentZone"
                                            component={Select}
                                            label="Zona padre"
                                            variant="standard"
                                            {...props.input}
                                        >
                                            {
                                                proZones.filter( proZone => (proZone.type === 1 || proZone.type === 2)
                                                ).map((filterZone,key) => (<MenuItem style={{display: "list-item"}} key={key} value={filterZone.id}>{filterZone.alias}</MenuItem>))
                                            }
                                        </Select>
                                        {
                                            props.meta.error && props.meta.touched &&
                                            <p className="regionZoneError" >{props.meta.error}</p>
                                        }
                                    </>
                                )}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <Field fullWidth required name="action" label="Acción">
                                {props => (
                                    <>
                                        <InputLabel className={props.meta.error && props.meta.touched ? "textError":""} >Acción</InputLabel>
                                        <Select
                                            fullWidth
                                            required
                                            name="action"
                                            component={Select}
                                            label="Acción"
                                            variant="standard"
                                            {...props.input}
                                        >
                                            {
                                                zoneActions.map((action,key) => (
                                                    <MenuItem style={{display: "list-item"}} key={key} value={action.id}>{action.name}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        {
                                            props.meta.error && props.meta.touched &&
                                            <p className="regionZoneError" >{props.meta.error}</p>
                                        }
                                    </>
                                )}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                value={regionZone}
                                defaultValue={regions[0]?[regions[0].name]:[]}
                                required
                                onChange={(event, newValue) => {
                                    if (typeof newValue === 'string') {
                                    setRegionZone({
                                        name: newValue,
                                    });
                                    } else if (newValue && newValue.inputValue) {
                                    // Create a new value from the user input
                                    setRegionZone({
                                        name: newValue.inputValue,
                                    });
                                    } else {
                                        setRegionZone(newValue);
                                    }
                                    //error state
                                    if(newValue){
                                        regionRef.current.classList.remove('MuiInput-underline');
                                        regionRef.current.classList.remove('Mui-error');
                                        regionRef.current.classList.remove('autocompleteError');
                                        setDisplayErrorRegion('none')
                                    }else{
                                        regionRef.current.classList.add('MuiInput-underline');
                                        regionRef.current.classList.add('Mui-error');
                                        regionRef.current.classList.add('autocompleteError');
                                        setDisplayErrorRegion('initial')
                                    }
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);

                                    const { inputValue } = params;
                                    // Suggest the creation of a new value
                                    const isExisting = options.some((option) => inputValue === option.title);
                                    if (inputValue !== '' && !isExisting) {
                                    filtered.push({
                                        inputValue,
                                        name: `Add "${inputValue}"`,
                                    });
                                    }

                                    return filtered;
                                }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                id="free-solo-with-text-demo"
                                options={regions}
                                getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === 'string') {
                                    return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                    return option.inputValue;
                                    }
                                    // Regular option
                                    return option.name;
                                }}
                                //renderOption={(props, option) => <li {...props}>{option.name}</li>}
                                renderOption={(props, option, { selected }) => (<li {...props}>{option.name}</li>
                                )}
                                sx={{ width: "100%" }}
                                freeSolo
                                renderInput={(params) => (
                                    <>
                                        <Field
                                            ref={regionRef}
                                            fullWidth
                                            required
                                            name="region"
                                            type="text"
                                            className='IconButtonForm'
                                            component={TextField}
                                            {...params}
                                            label="Region"
                                            variant="standard"
                                            onChange={()=>{
                                                //console.log(params)
                                            }}
                                        />
                                        <p className="regionZoneError" style={{display:`${displayErrorRegion}`}} >Requerido</p>
                                    </>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field name="color">
                            {props => (
                                <>
                                    <ColorPalette {...props.input} name="color" value={color} type="input" onSelect={handleChangeColor} palette={palette} />
                                </>
                            )}
                            </Field>
                        </Grid>
                        <Grid item style={{ marginTop: 16 }}>
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
                        <Grid item style={{ marginTop: 16 }}>
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
                </Paper>
            </form>
            )}
        />
    )
}


export default SubmitFormUpdateComponent
