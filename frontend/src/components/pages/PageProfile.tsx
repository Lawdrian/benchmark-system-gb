import React, {useState} from "react";
import {
    Box,
    Button,
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
import {deleteUser, register} from "../../actions/auth";
import {useNavigate} from "react-router-dom";

const mapStateToProps = (state: RootState) => ({
    user: state.auth.user
})

const connector = connect(mapStateToProps, {deleteUser});

type ReduxProps = ConnectedProps<typeof connector>

type ProfileProps = ReduxProps & {
    loginUrl: string
}

const PageProfile = ({deleteUser, user, loginUrl}: ProfileProps) => {

    const [openDialog, setOpenDialog] = useState<boolean>(false)

    const navigate = useNavigate()

    const handleDelete = () => {
        deleteUser()
    }

    const tableData = [
        {'Betriebsname': user?.profile?.company_name},
        {'Email': user?.username}
        ]


    return (
        <Box sx={{width: '100%'}}>
            <Grid container xs={12} direction="column">
                <Grid item xs={10}>
                    <Paper variant="outlined" >
                        <Typography variant="h5" sx={{p:2}}>
                            Benutzermanagement
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
            </Grid>
        </Box>
    );
}

export default connector(PageProfile);