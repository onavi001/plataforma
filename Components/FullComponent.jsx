
import ButtonGroupComponent from "./ButtonGroupComponent.jsx";
import Grid from '@mui/material/Grid';
const FUllComponent = ({
    Titulo,
    Body,
    columns,
    rows,
    buttonGroupPage,
    handleEditCellChangeCommitted,
    selectionModel,
    setSelectionModel,
    classComponent,
    data,
    buttonGroupFooter = [],
    setData,
    classGridComponent,
    checkboxSelectionOption,
    exportPermission,
    classBody,
    buttonClass,
    isCellEditableFlag
}) => (
    <div className={`${classComponent}`} style={{width: "100%",padding: "12px 0px"}} >
        <div className="cardComponent">
            {
                Titulo || buttonGroupPage ?
                <>
                    <Grid container justifyContent="space-between"  style={{alignItems: "left"}}>
                        <Grid item style={{margin: "0 20px",alignSelf: "center"}} >
                            <span style={{float:"left", fontSize:"25px"}}>
                                {Titulo}
                            </span>
                        </Grid>
                        <Grid item style={{margin: "0 20px",alignSelf: "center"}} >
                            <ButtonGroupComponent buttonClass={buttonClass} buttonGroupPage={buttonGroupPage} />
                        </Grid>
                    </Grid>
                    {
                        /** <div className="" style={{height: "60px", padding: "9px 25px 9px 25px"}}>
                        <h1 style={{float:"left", fontSize:"25px"}}>
                            {Titulo}
                        </h1>
                        <ButtonGroupComponent buttonClass={buttonClass} buttonGroupPage={buttonGroupPage} />
                    </div>*/
                    }
                </>
                :null
            }
            <div style={{}} className={classBody}>
                {/** */}
                {
                    Body ?
                        <Body
                            key={`tabla_${Titulo}`}
                            columns={columns}
                            rows={rows}
                            handleEditCellChangeCommitted={handleEditCellChangeCommitted}
                            selectionModel={selectionModel}
                            setSelectionModel={setSelectionModel}
                            data={data}
                            classGridComponent={classGridComponent}
                            setData={setData}
                            checkboxSelectionOption={checkboxSelectionOption}
                            exportPermission={exportPermission}
                            isCellEditableFlag={isCellEditableFlag}
                        />
                    :
                        null
                }
            </div>
            {
                buttonGroupFooter.length > 0 ?
                    <div style={{height: "50px",padding: "5px"}}>
                        <ButtonGroupComponent buttonGroupPage={buttonGroupFooter} />
                    </div>
                :
                    null
            }
        </div>
    </div>
);

export default FUllComponent;
