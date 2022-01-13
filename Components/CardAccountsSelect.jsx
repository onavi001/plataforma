import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { Button } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
const CardAccountsSelect = ({onSubmitUpdateZoneRoot,validateZoneRoot,accounts,label}) => (
    <Card sx={{ maxWidth: 350, minWidth: 100 }} style={{position: "fixed",top:"200px",left:"50%",transform:"translate(-50%,-50%)"}}>
        <CardHeader
            style={{padding: "5px", background:"#1269b3",color:"#FFF",textAlign:"-webkit-center"}}
            title="Seleccione su cuenta"
            titleTypographyProps={{fontSize:"20px"}}
        />
        <CardContent>
            <Grid item xs={12} style={{paddingLeft: "32px"}}>
                <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
                    {
                        <Form
                            onSubmit={onSubmitUpdateZoneRoot}
                            validate={validateZoneRoot}
                            render={({ handleSubmit, reset, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit} noValidate>
                                <Paper style={{ padding: 16 }}>
                                <Grid container alignItems="flex-start" spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                                fullWidth
                                                required
                                                name="account"
                                                label="Cuentas"
                                            >
                                            {props => (
                                                <>
                                                    <InputLabel className={props.meta.error && props.meta.touched ? "textError":""} >Cuentas</InputLabel>
                                                    <Select
                                                        fullWidth
                                                        name="account"
                                                        label="Cuentas"
                                                        variant="standard"
                                                        {...props.input}
                                                    >
                                                        {
                                                            accounts ? accounts.map((account,key) => (
                                                                <MenuItem style={{display: "list-item"}} key={account.id} value={account.id}>{account.name}</MenuItem>
                                                            ))
                                                            :
                                                            []
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
                                    <Grid item style={{ marginTop: 16 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={submitting}
                                        >
                                            {label}
                                        </Button>
                                    </Grid>
                                </Grid>
                                </Paper>
                            </form>
                            )}
                        />
                    }
                </div>
            </Grid>
        </CardContent>
    </Card>
)
export default CardAccountsSelect;