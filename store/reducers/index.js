import { combineReducers } from "redux";
import usuarioReducer from "./usuarioReducer";
import unidadesReducer from "./unidadesReducer";
import accountsReducer from "./accountsReducer";
import devicesReducer from "./devicesReducer";
import zonesReducer from "./zonesReducer";
import rulesReducer from "./rulesReducer";
export default combineReducers({
    usuario: usuarioReducer,
    unidades: unidadesReducer,
    accounts: accountsReducer,
    devices: devicesReducer,
    zones: zonesReducer,
    rules: rulesReducer,
});