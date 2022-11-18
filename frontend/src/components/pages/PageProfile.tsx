import React, {useState} from "react";
import {
    Box,
    Button, Card, CardContent,
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
import {SectionDivider} from "../utils/inputPage/layout";
import {DatasetSummary} from "../../types/reduxTypes";

const mapStateToProps = (state: RootState) => ({
    user: state.auth.user,
    profileData: state.profile.profileData
})

const connector = connect(mapStateToProps, {deleteUser, loadProfile});

type ReduxProps = ConnectedProps<typeof connector>

type ProfileProps = ReduxProps & {}

const PageProfile = ({deleteUser, user, profileData, loadProfile}: ProfileProps) => {
    // Load profile data
    React.useEffect(() => {
        loadProfile()
    }, [])
    const [openDialog, setOpenDialog] = useState<boolean>(false)


    const handleDelete = () => {
        deleteUser()
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
                    : undefined
                }
            </Grid>
        </Box>
    );
}

export default connector(PageProfile);



const DatasetCard = (data: DatasetSummary) => {
    return (
        <Card sx={{ minWidth: 100, maxWidth: 250 }}>
            <CardContent>
                <Typography sx={{ mb: 1.5 }} variant="h6" component="div">
                    Jahr: {data.label}
                </Typography>
                <Typography sx={{textDecoration: 'underline'}} variant="subtitle1" component="div">
                    Footprints
                </Typography>
                <Typography  color="text.secondary">
                    CO2: {data.co2_footprint} kg
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    H2O: {data.h2o_footprint} m3
                </Typography>
            </CardContent>
        </Card>
    );
}
