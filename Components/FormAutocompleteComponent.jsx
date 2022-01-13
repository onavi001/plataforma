
import React, {useEffect} from 'react';
import { Grid, MenuItem, InputAdornment, TextField } from '@material-ui/core';
import { FaInfoCircle } from 'react-icons/fa';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
//import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Tooltip from '@mui/material/Tooltip';
const FormAutocompleteComponent = ({data=[],setData}) => {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const RefCheckBoxGroup = React.useRef();
    const handleEditClick = (e,value,dat) => {
        console.log(value)
        const valueIds = value.map(val => val.id)
        e.preventDefault()
        if(dat.onClickFuntion){
            dat.onClickFuntion(e,valueIds,data)
        }
        setData(data.map(dat2 =>{
            if (dat2.prop === dat.prop) {
                dat2.value=valueIds;
                dat2.state=valueIds;
                dat2.errorState="";
                return dat2;
            }else{
                return dat2;
            }
        }))
    };
    const handleChange = (e,dat) => {
        e.preventDefault();
        if(dat.onClickFuntion){
            data = dat.onClickFuntion(e,data)
            setData(data)
        }else{
            setData(data.map(dat2 =>{
                if (dat2.prop === dat.prop) {
                    dat2.value=e.target.value;
                    dat2.state=e.target.value;
                    dat2.errorState="";
                    return dat2;
                }else{
                    return dat2;
                }
            }))
        }
        console.log(data)
    };
    const [values, setValues] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });
    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleFocus = (e,id,index) => {
        e.preventDefault();
        let nextElement = index + 1;
        if (nextElement > data.length - 1) {
            nextElement=0;
        }
        const elemento = document.getElementById(data[nextElement].fileName);
        elemento.focus();
    }
return(
    <Grid container spacing={3}>
        {
            data.map((dat,index) => (
                <>
                    {
                        dat.prop ?
                            <Grid item xs={6} className="basicFormComponent">
                                {
                                    dat.type === "Autocomplete" ?
                                        <Autocomplete
                                            className="deviceChip"
                                            ref={RefCheckBoxGroup}
                                            style={{ width: "60%",maxWidth:"60%"}}
                                            multiple
                                            id="checkboxes-tags-demo"
                                            options={dat.option}
                                            onChange = {(e,value) => handleEditClick(e,value,dat) }
                                            limitTags={2}
                                            disableCloseOnSelect={true}
                                            getOptionLabel={(option) => option.name}
                                            renderOption={(props, option, { selected }) => (
                                                <li {...props}>
                                                    <Checkbox
                                                        icon={icon}
                                                        checkedIcon={checkedIcon}
                                                        style={{ marginRight: 8 }}
                                                        checked={selected}
                                                    />
                                                    {option.name}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField className='IconButtonForm' {...params} variant="standard" label={dat.fileName} placeholder={dat.placeholder ? dat.placeholder : "" } />
                                            )}
                                        />
                                    :
                                        <TextField
                                            className=""
                                            style={{width: "60%",maxWidth:"60%"}}
                                            id={dat.fileName}
                                            name={dat.fileName}
                                            //ref={dat.ref}
                                            label={dat.fileName}
                                            type={dat.type === 'password'? (values.showPassword ? 'text' : 'password') : "text"}
                                            select={ dat.option ? true : false }
                                            value={dat.state}
                                            onChange={e => handleChange(e,dat) }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        className='IconButtonForm'
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                    {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            // event => dat.setState(event.target.value)
                                            InputProps={{
                                                placeholder : dat.placeholder ? dat.placeholder : "",
                                                defaultValue: dat.state,
                                                className: dat.errorState,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        { dat.icon ? dat.icon : null}
                                                    </InputAdornment>
                                                ),
                                                endAdornment:(
                                                    <InputAdornment position="end" onFocus={ e => handleFocus(e,dat.fileName,index) }>
                                                        {
                                                            dat.type ===  'password' ?
                                                                <IconButton
                                                                    className='IconButtonForm'
                                                                    aria-label="toggle password visibility"
                                                                    onClick={handleClickShowPassword}
                                                                    onMouseDown={handleMouseDownPassword}
                                                                    edge="end"
                                                                    >
                                                                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            :
                                                                null
                                                        }
                                                        {
                                                            dat.infoData ?
                                                                <Tooltip title={dat.infoData} arrow>
                                                                    <IconButton className='IconButtonForm' style={{color:'gray', fontSize: "20px", paddingLeft:'5px'}}>
                                                                        <FaInfoCircle/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            :
                                                                null
                                                        }
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            {
                                                dat.option ?
                                                dat.option.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                    </MenuItem>
                                                )):
                                                null
                                            }
                                        </TextField>
                                }
                            </Grid>
                        :
                            <Grid item xs={6} className="basicFormComponent"></Grid>
                    }
                </>
            ))
        }
    </Grid>
)};

export default FormAutocompleteComponent;
