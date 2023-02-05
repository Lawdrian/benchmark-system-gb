import React, {useState} from "react";
import {
    Box,
    Button, Card, CardActions, CardContent,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper, Table, TableBody, TableCell,
    TableRow,
    Typography
} from "@mui/material";
import {RootState} from "../../store";
import {connect, ConnectedProps} from "react-redux";
import {deleteUser} from "../../actions/auth";
import {loadProfile} from "../../actions/profile";
import {SectionDivider} from "../utils/input/layout";
import {DatasetSummary} from "../../types/reduxTypes";
import {loadDatasets} from "../../actions/dataset";
import {fillInputState, parseStringToArray, emptyDataset} from "../../helpers/InputHelpers";
import PageInputData, {DataToSubmit, InputMode} from "./input/PageInputData";

const mapStateToProps = (state: RootState) => ({
    dataset: state.dataset,
    user: state.auth.user,
    profileData: state.profile.profileData
})

const connector = connect(mapStateToProps, {deleteUser, loadProfile, loadDatasets});

type ReduxProps = ConnectedProps<typeof connector>

type ProfileProps = ReduxProps & {}

const PageProfile = ({deleteUser, user, profileData, dataset, loadProfile, loadDatasets}: ProfileProps) => {
    // Load profile data
    React.useEffect(() => {
        loadProfile()
        if (!dataset.successful) {
            loadDatasets()
        }
    }, [])
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [inputFieldData, setInputFieldData] = useState<DataToSubmit>(emptyDataset)
    const [selectedDatasetId, setSelectedDatasetId] = useState<number>(0)

    const handleDelete = () => {
        deleteUser()
    }


    const handleDatasetUpdate = (greenhouseId: number, datasetId: number) => {

        if (dataset.datasets != [] && dataset.datasets != "" && typeof dataset.datasets != "string") {
            const initialGreenhouse = dataset.datasets.filter(greenhouse => parseInt(parseStringToArray(greenhouse.greenhouse_specs)[0]) == greenhouseId)[0]
            const initialDataset = initialGreenhouse.greenhouse_datasets.filter(dataset => parseInt(parseStringToArray(dataset.greenhouse_data_id)[0]) == datasetId)[0]
            setInputFieldData(fillInputState(initialDataset))
            setSelectedDatasetId(datasetId)
        }
    }


    const DatasetCard = (data: DatasetSummary) => {
        return (
            <Card sx={{minWidth: 100, maxWidth: 250}}>
                <CardContent>
                    <Typography sx={{mb: 1.5}} variant="h6" component="div">
                        Jahr: {data.label}
                    </Typography>
                    <Typography sx={{textDecoration: 'underline'}} variant="subtitle1" component="div">
                        Footprints
                    </Typography>
                    <Typography color="text.secondary">
                        CO2: {data.co2Footprint} kg
                    </Typography>
                    <Typography  color="text.secondary">
                        H2O: {data.h2oFootprint} Liter
                    </Typography>
                </CardContent>
                <CardActions sx={{mb: 1.5}}>
                        <Button onClick={() => handleDatasetUpdate(data.greenhouseId, data.datasetId)}>Ändern</Button>
                </CardActions>
            </Card>
        );
    }

    if (inputFieldData != emptyDataset) {
        return(
            <PageInputData initialData={inputFieldData} mode={InputMode.update} datasetId={selectedDatasetId}/>
        )
    }

    return (
        <Box sx={{width: '100%'}}>
            <Grid container xs={12} direction="column">
                <Grid item xs={10}>
                    <Paper variant="outlined" >
                        <Typography variant="h5" sx={{p:2}}>
                            Benutzer
                        </Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Betriebsname</TableCell>
                                    <TableCell>{user?.profile?.company_name ?? "default"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>{user?.email ?? "default"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Passwort</TableCell>
                                    <TableCell>*****</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                            <>
                                <DialogTitle>Sind Sie sicher?</DialogTitle>
                                 <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Nachdem Sie Ihren Account gelöscht haben, kann dieser nicht mehr hergestellt werden!
                                    </DialogContentText>
                                         <DialogActions>
                                             <Button onClick={() => setOpenDialog(false)}>Abbrechen</Button>
                                             <Button color="error" onClick={handleDelete} autoFocus>Bestätigen</Button>
                                         </DialogActions>
                                </DialogContent>
                            </>
                        </Dialog>
                        <Button
                            variant="contained"
                            sx={{mt: 3, mb: 2, ml:2}}
                            color="error"
                            onClick={() => setOpenDialog(true)}
                        >
                            Account löschen
                        </Button>
                    </Paper>
                </Grid>
                <SectionDivider title={"Datensätze"}/>
                {profileData.length != 0 ?
                    <Grid container xs={12}>
                        {profileData.map( (greenhouse) => {
                            return (
                                <Grid container direction={"row"} xs={12} sx={{mt:2}}>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" sx={{p:2}}>
                                            Gewächshaus: {greenhouse.greenhouse_name}
                                        </Typography>
                                    </Grid>
                                    <Grid container direction={"row"} spacing={2} justifyContent={"start"} xs={12}>
                                        {greenhouse.data.map((dataset: DatasetSummary) => {
                                            return (
                                                <Grid item xs={3}>
                                                    <DatasetCard {...dataset}/>
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </Grid>
                    :
                        <p>
                            Es wurden noch keine Datensätze eingegeben.
                        </p>
                }
            </Grid>
        </Box>
    );
}

export default connector(PageProfile);
