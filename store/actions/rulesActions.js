import {
    CREATERULES,
    CREATERULESSUCCESS,
    CREATERULESERROR,
    GETRULES,
    GETRULESSUCCESS,
    GETRULESERROR,
    UPDATERULES,
    UPDATERULESSUCCESS,
    UPDATERULESERROR,
    DELETERULES,
    DELETERULESSUCCESS,
    DELETERULESERROR,
    CHANGESTATERULES
} from '../types';
import { rulesURL } from "../../services/api";
//getZones
export function getRulesAction(externalID) {
    return async (dispatch) => {
        dispatch( getRules() );
        try {
            rulesURL.get(`/ZoneRules/Accounts/${externalID}`,{headers: { }}).then(response => {
                if (response.status === 200) {
                    dispatch( getRulesSuccess(response.data) )

                }else{
                    dispatch( getRulesError() )
                }
            }).catch(function (error) {
                dispatch( getRulesError() )
            });
        } catch (error) {
            dispatch( getRulesError() )
        }
    }
}
const getRules = () => ({
    type: GETRULES
})
const getRulesSuccess = (rules) => ({
    type: GETRULESSUCCESS,
    payload : rules
})
const getRulesError = () => ({
    type: GETRULESERROR
})
//create rules
export function createRulesAction(newRule) {
    return async (dispatch) => {
        dispatch( createRules() );
        try {
            rulesURL.post(`/ZoneRules`,newRule,
            {
                headers: { }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    const rule = response.data;
                    dispatch(createRulesSuccess(rule))
                }else{
                    dispatch( createRulesError() )
                }
            }).catch(function (error) {
                dispatch( createRulesError() )
            });
        } catch (error) {
            dispatch( createRulesError() )
        }
    }
}
const createRules = () => ({
    type: CREATERULES
})
const createRulesSuccess = (rule) => ({
    type: CREATERULESSUCCESS,
    payload : rule
})
const createRulesError = () => ({
    type: CREATERULESERROR
})
//create rules
export function updateRulesAction(newRule,oldRule) {
    return async (dispatch) => {
        dispatch( updateRules() );
        try {
            rulesURL.put(`/ZoneRules/${oldRule.id}`,newRule,
            {
                headers: { }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    const rule = response.data;
                    oldRule.maxUnits = rule.maxUnits;
                    oldRule.timeBeforePit = rule.timeBeforePit;
                    oldRule.timeInPit = rule.timeInPit;
                    oldRule.timeAfterPit = rule.timeAfterPit;
                    dispatch(updateRulesSuccess(oldRule))
                }else{
                    dispatch( updateRulesError() )
                }
            }).catch(function (error) {
                dispatch( updateRulesError() )
            });
        } catch (error) {
            dispatch( updateRulesError() )
        }
    }
}
const updateRules = () => ({
    type: UPDATERULES
})
const updateRulesSuccess = (rule) => ({
    type: UPDATERULESSUCCESS,
    payload : rule
})
const updateRulesError = () => ({
    type: UPDATERULESERROR
})
//delete rules
export function deleteRulesAction(arrayRules,index) {
    return async (dispatch) => {
        dispatch( deleteRules() );
        try {
            rulesURL.delete(`/ZoneRules/${arrayRules[index]}`,
            {
                headers: { }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    index++;
                    if ( index > arrayRules.length - 1) {
                            dispatch(deleteRulesSuccess(arrayRules))
                    }else{
                        dispatch(deleteRulesAction(arrayRules,index))
                    }
                }else{
                    dispatch( deleteRulesError() )
                }
            }).catch(function (error) {
                dispatch( deleteRulesError() )
            });
        } catch (error) {
            dispatch( deleteRulesError() )
        }
    }
}
const deleteRules = () => ({
    type: DELETERULES
})
const deleteRulesSuccess = (rule) => ({
    type: DELETERULESSUCCESS,
    payload : rule
})
const deleteRulesError = () => ({
    type: DELETERULESERROR
})
export function changeStateRules(){
    return (dispatch) => {
        dispatch({
            type: CHANGESTATERULES
        })
    }
}