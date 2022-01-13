import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useEffect } from "react";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};
function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: 'theme.palette.background.paper',
        display: 'flex',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));
const VerticalTabComponent = ({data}) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    useEffect(() => {
        const getIndexDefault = () => {
            const dataIndexs = data.map((dat,index) => ({index,focusOn:dat.focusOn}))
            const foundfocusOn = dataIndexs.find(dat => dat.focusOn && dat.focusOn === true)
            if (foundfocusOn) {
                setValue(foundfocusOn.index)
            }
        }
        getIndexDefault()
    }, [data])
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const TabDoubleClick = (e) => {
        e.preventDefault();
    }
    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                {
                    data.map((dat,index) => (
                        <Tab key={`VerticalTabComponent_Tab${index}`} onDoubleClick={e => TabDoubleClick(e)} label={dat.label} {...a11yProps(index)} />
                    ))
                }
            </Tabs>
            {
                data.map((dat,index) => (
                    <TabPanel key={`VerticalTabComponent_TabPanel${index}`} style={{padding:"0px !important", width:"100%"}} value={value} index={index}>
                        {dat.body}
                    </TabPanel>
                ))
            }
        </div>
    );
}
export default VerticalTabComponent;