
import ButtonGroupComponent from "./ButtonGroupComponent";
import '../styles/cardComponent.module.scss'
const CardComponent = ({
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
    buttonGroupFooter=[],
    setData,
    classGridComponent,
    checkboxSelectionOption,
    classBody,
    arrayPath,
    handleEditZone,
    initialCenter,
    setArrayPath,
    initialZoom,
    setInitialCenter,
    setCenterMap,
    centerMap
}) => (
    <div className={`${classComponent} bodyCardComponent`} >
        <div className="cardComponent">
            {
                Titulo ?
                    <div className="bg_intralix_header" style={{height: "45px", padding: "10px", borderTopLeftRadius : ".375rem",  borderTopRightRadius: ".375rem"}}>
                        <span style={{float:"left"}}>
                            {Titulo}
                        </span>
                        <ButtonGroupComponent buttonGroupPage={buttonGroupPage} />
                    </div>
                :null
            }
            <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius:"0 0 13px 13px"}} className={classBody}>
                {/** */}
                {
                    <div style={{padding: "1rem",}} >
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
                            arrayPath={arrayPath}
                            setArrayPath={setArrayPath}
                            handleEditZone={handleEditZone}
                            initialCenter={initialCenter}
                            initialZoom={initialZoom}
                            setInitialCenter={setInitialCenter}
                            setCenterMap={setCenterMap}
                            centerMap={centerMap}
                        />
                    </div>
                }
                {
                    buttonGroupFooter.length > 0 ?
                        <div style={{borderTop: "1.5px solid rgba(0,0,0,0.3)"}}>
                            <div style={{height: "40px",padding: "5px"}}>
                                <ButtonGroupComponent buttonGroupPage={buttonGroupFooter} />
                            </div>
                        </div>
                    :
                        null
                }
            </div>
        </div>
    </div>
);

export default CardComponent;
