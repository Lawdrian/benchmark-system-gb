/**
 * #####################################################################
 * This is the page component for rendering the pre data inputpage. The
 * user gets to this page by clicking on "Dateneingabe" on the left
 * drawer. This page lets the user select one of his greenhouses, or
 * create a new one. The user will then be bought to the input page:
 * PageInputData.tsx
 *######################################################################
 */


import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as React from "react";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import PageInputData, {DataToSubmit, InputMode} from "./PageInputData";
import {useEffect, useState} from "react";
import FormControl from "@mui/material/FormControl";
import {Divider, FormHelperText, InputLabel} from "@mui/material";
import DynamicSelect, {DynamicSelectProps} from "../../utils/DynamicSelect";
import {loadDatasets} from "../../../actions/dataset";
import {Option} from "../../../reducers/lookup";
import TextField, {TextFieldProps} from "@mui/material/TextField";
import {resetSubmissionState} from "../../../actions/submission";
import {loadLookupValues} from "../../../actions/lookup";
import {fillInputState, findOptionId, parseStringToArray, emptyDataset} from "../../../helpers/InputHelpers";
import {companyValid, containsSpecialChars, getCompanyHelperText} from "../../../helpers/UserManagement";



const mapStateToProps = (state: RootState) => ({
    dataset: state.dataset,
    lookupValues: state.lookup.lookupValues,
    isLoading: state.lookup.isLoading
});

const mapDispatchToProps = {
    loadDatasets,
    loadLookupValues,
    resetSubmissionState
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

type PreInputDataProps = ReduxProps & {
}

const PagePreInputData = ({resetSubmissionState,loadDatasets, loadLookupValues, isLoading, dataset, lookupValues}: PreInputDataProps) => {
    useEffect(() => {
        if (!dataset.successful) {
            loadDatasets()
        }
        loadLookupValues()
    }, [])

    const [selectedGreenhouse, setSelectedGreenhouse] = useState<number | null>(null)


    enum PageStatus {
        PreInput = "PreInput",
        NewGH = "NewGH",
        OldGH = "OldGH",
    }
    const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.PreInput)
    const [nameTries, setNameTries] = useState<number>(0)
    const [selectTries, setSelectTries] = useState<number>(0)




    const [inputFieldData, setInputFieldData] = useState<DataToSubmit>(emptyDataset)


    const hasNameTried = () => {
        return nameTries > 0
    }

    const nameHelperText = (name: string) => {
        if (name == "") return "Bitte geben Sie einen Namen für Ihr Gewächshaus ein"
        else if(containsSpecialChars(name)) return "Es sind keine Sonderzeichen für den Gewächshausnamen erlaubt"
        else return "Es ist ein Fehler aufgetreten. Bitte wählen Sie einen anderen Namen für das Gewächshaus"
    }

    const hasSelectTried = () => {
        return selectTries > 0
    }




    // Load the greenhouse dataset
    let lookupGreenhouses: Option[] = []
    if(dataset.datasets != []) {
        if(dataset.datasets != "" && typeof dataset.datasets != "string") {
            const greenhouses = dataset.datasets.map(greenhouse => greenhouse.greenhouse_specs)

            greenhouses.forEach((greenhouse, index) => {
                const currentGreenhouse = parseStringToArray(greenhouse)
                lookupGreenhouses[index] = {id: parseInt(currentGreenhouse[0]), values: currentGreenhouse[1]}
            })
        }
        else if(dataset.datasets == "") {
            console.log("Dataset corrupted")
        }

    }
    // Render the Inputpages with already filled out input fields.
    // The data for the input fields comes from the most recent dataset from the selected greenhouse
    const renderFilledInputPages = () => {
        if (selectedGreenhouse != null && dataset.datasets != "" && typeof dataset.datasets != "string") {
            const initialDataset = dataset.datasets.filter(value => parseInt(parseStringToArray(value.greenhouse_specs)[0]) == selectedGreenhouse)[0]
            // Set the state with the last created greenhouse data
            setInputFieldData(fillInputState(initialDataset.greenhouse_datasets[initialDataset.greenhouse_datasets.length-1]))
            resetSubmissionState()
            setPageStatus(PageStatus.OldGH)
        }
        setSelectTries(selectTries + 1)
    }

    const renderEmptyInputPages = () => {
        if(inputFieldData.companyInformation.gewaechshausName != null && inputFieldData.companyInformation.gewaechshausName != "" && !containsSpecialChars(inputFieldData.companyInformation.gewaechshausName)) {
            resetSubmissionState()

            if(!isLoading) {
                setInputFieldData({...inputFieldData,
                    companyInformation: {
                        ...inputFieldData.companyInformation,
                        energieschirm: findOptionId(lookupValues["Energieschirm"], "nein"),
                        zusaetzlichesHeizsystem: findOptionId(lookupValues["ZusaetzlichesHeizsystem"], "nein"),
                        land: findOptionId(lookupValues["Land"], "Germany")
                    },
                    cultureInformation: {
                        ...inputFieldData.cultureInformation,
                        snack: findOptionId(lookupValues["10-30Gramm(Snack)"], "nein"),
                        cocktail: findOptionId(lookupValues["30-100Gramm(Cocktail)"], "nein"),
                        rispen: findOptionId(lookupValues["100-150Gramm(Rispen)"], "nein"),
                        fleisch: findOptionId(lookupValues[">150Gramm(Fleisch)"], "nein"),
                        nebenkultur: findOptionId(lookupValues["Nebenkultur"], "nein"),
                    },
                    energyConsumption: {
                        ...inputFieldData.energyConsumption,
                        waermeversorgung: findOptionId(lookupValues["Waermeversorgung"], "nein"),
                        zusatzbelichtung: findOptionId(lookupValues["Zusatzbelichtung"], "nein")
                    },
                    waterUsage: {
                        ...inputFieldData.waterUsage,
                        wasserVerbrauch: findOptionId(lookupValues["WasserVerbrauch"], "nein")
                    },
                    companyMaterials: {
                        ...inputFieldData.companyMaterials,
                        growbagsKuebel: findOptionId(lookupValues["GrowbagsKuebel"], "nichts"),
                        schnur: findOptionId(lookupValues["Schnur"], "nein"),
                        klipse: findOptionId(lookupValues["Klipse"], "nein"),
                        rispenbuegel: findOptionId(lookupValues["Rispenbuegel"], "nein"),
                        jungpflanzenZukauf: findOptionId(lookupValues["Jungpflanzen:Zukauf"], "nein")
                    },
                });
            }
            setPageStatus(PageStatus.NewGH)
        }
        setNameTries(nameTries+1)
    }



    const ghSelectProps: DynamicSelectProps<any> = {
        "lookupValues": lookupGreenhouses,
        value: selectedGreenhouse,
        onChange: event => {
            setSelectedGreenhouse(parseFloat(event.target.value))
            setSelectTries(0)
        },
        error: hasSelectTried()
    }


    // Properties of the input fields
    const gewaechshausNameProps: TextFieldProps = {
        label: "Gewächshaus Name",
        value: inputFieldData.companyInformation.gewaechshausName,
        onChange: event => {
            setInputFieldData({
                ...inputFieldData,
                    companyInformation: {
                    ...inputFieldData.companyInformation,
                        gewaechshausName: event.target.value
                }}
            ),
            setNameTries(0)
        },
        error: hasNameTried(),
        helperText: hasNameTried() ? nameHelperText(inputFieldData.companyInformation.gewaechshausName ?? ""): undefined,
        type:"text",
        placeholder:"Name",
    }


    if(pageStatus == PageStatus.PreInput) {

        return (
            <Container component="main" maxWidth="lg">
                <Box
                    sx={{
                        height: '50vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center´'
                    }}
                >
                    <Grid container direction={"row"} xs={12} >
                        <Grid container item  alignItems="center" justifyContent="center">
                            <Typography component="h1" variant="h5">
                                Neuen Datensatz anlegen
                            </Typography>
                        </Grid>
                        <Grid container item alignItems={"center"} justifyContent={"center"}  xs={12}>
                            <Grid item xs={8}>
                                <p>
                                    Sie haben den ersten Schritt getätigt um einen neuen Datensatz anzulegen. Nun haben Sie zwei Optionen zur Auswahl.
                                    Entweder Sie legen einen komplett neuen Datensatz an (bei Erstnutzung oder Hinzufügen eines weiteren Gewächshauses), oder Sie wählen ein bestehendes/ bereits hinterlegtes Haus aus und nehmen Änderungen am Datensatz vor.
                                    Dies ist besonders sinnvoll, wenn Sie für ein bestehendes Haus ein weiteres Kulturjahr hinterlegen wollen um die Veränderungen der Fußabdrücke über die Jahre betrachten zu wollen.
                                    In diesem Fall ändern Sie im Datensatz bspw. das Kulturjahr, bauliche Änderungen, Erträge, Verbräuche und so weiter.
                                </p>
                            </Grid>
                        </Grid>
                        <Grid container direction={"row"} xs={12} sx={{pt:8}} alignItems="center" justifyContent="center" >
                            <Grid item container xs={4} alignItems="center" justifyContent="center" sx={{pr:4}} spacing={1}>
                                <Typography component="h1" variant="subtitle2">
                                    Für bestehendes Gewächshaus
                               </Typography>
                                <FormControl fullWidth sx={{mt:2}}>
                                    <InputLabel id="amount-select-label">Gewächshaus</InputLabel>
                                <DynamicSelect label="GWH" {...ghSelectProps} />
                                    <FormHelperText error>{hasSelectTried() ? "Bitte wählen Sie eines Ihrer Gewächshäuser aus": ""}</FormHelperText>
                                </FormControl>
                                <Button
                                    sx={{mt:2}}
                                    onClick={(event) => renderFilledInputPages()}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    anlegen
                                </Button>
                            </Grid>
                            <Divider orientation="vertical" flexItem> oder </Divider>
                            <Grid item container xs={4} alignItems="center" justifyContent="center" sx={{pl:4}} spacing={1}>
                                <Typography component="h1" variant="subtitle2" >
                                    Für neues Gewächshaus
                                </Typography>
                                <TextField
                                    sx={{mt:2}}
                                    placeholder='Gewächshaus Name'
                                    onWheel={(event) => event.currentTarget.querySelector('input')?.blur()}
                                    {...gewaechshausNameProps}
                                    fullWidth
                                />
                                <Button
                                    sx={{mt:2}}
                                    onClick={(event) => renderEmptyInputPages()}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    erstellen
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        )
    }
    else if(pageStatus == PageStatus.NewGH) {
        console.log("NEW initialData:")
        console.log(inputFieldData)
        return <PageInputData initialData={inputFieldData} mode={InputMode.create}/>
    }
    else if(pageStatus == PageStatus.OldGH) {
        console.log("OLD initialData:")
        console.log(inputFieldData)
        return <PageInputData initialData={inputFieldData} mode={InputMode.create}/>
    }
    else
        throw new Error('pageStatus is invalid!')



}
export default connector(PagePreInputData)