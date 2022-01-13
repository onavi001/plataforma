import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const ConfirmDialogComponent = ({open, setOpen, TituloDialog, Body, actionFunction}) => {
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{TituloDialog}</DialogTitle>
                <DialogContent>
                    <Body/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cerrar</Button>
                    {
                        actionFunction?
                        <Button onClick={actionFunction}>Enviar</Button>
                        :
                        null
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ConfirmDialogComponent;