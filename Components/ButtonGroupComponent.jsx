
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

const ButtonGroupComponent = ({buttonGroupPage=[],buttonClass}) => (
    <ButtonGroup size="small" variant="contained" aria-label="small primary button group" style={{float:"right"}} className={buttonClass} >
        {
            buttonGroupPage.map((but,index) => (
                <Button
                    key={ `ButtonGroupComponent_Button_${index}` }
                    onClick={ e => but.funcion(e) }
                    className={ but.clase } >
                        { but.icono }
                        { but.nombre }
                </Button>
            ))
        }
    </ButtonGroup>
);

export default ButtonGroupComponent;
