import React, { useEffect, useCallback, useState } from "react"

import { DataGrid, GridRowsProp, GridColDef, GridRowModel, GridRowParams, MuiEvent, GridEventListener, GridRowId, GridRowModes, GridRowModesModel, GridToolbarContainer, GridAddIcon } from '@mui/x-data-grid';
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import axios from "axios";

const headers: GridColDef[] = [
    { field: 'itemno', headerName: 'Item No.', width: 150 },
    { field: 'description', editable: true, headerName: 'Description', width: 150 },
    { field: 'unit', editable: true, headerName: 'Unit', width: 150 },
    { field: 'qty', editable: true, headerName: 'Qty', width: 150 },
    { field: 'rate', editable: true, headerName: 'Rate', width: 150 },
    { field: 'amount', editable: true, headerName: 'Amount', width: 120 }
]


const Home = () => {
    const [rows, setRows] = useState<any[]>([]);
    const [editedRows, setEditedRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchData = async () => {
        setLoading(true);
        setError("");

        await axios.get(`http://localhost:7000/api/v1/tasklist`)
            .then((res) => {
                setLoading(false);

                if (res.data && res.data.message === "success") {
                    setRows(res.data.data);
                    setError("");
                } else {
                    setError("No task records found");
                }
            })
            .catch((err) => {
                setLoading(false);
                setError("Something went wrong");
            })
    }

    const updateData = React.useCallback(async (newData: any) => {

        console.log(newData);
        setEditedRows(newData);
        setLoading(true);
        setError("");

        await axios.put(`http://localhost:7000/api/v1/tasklist/${newData.id}`, newData)
            .then((res) => {
                setLoading(false);
                setTimeout(() => {
                    setError("");
                }, 1400);

                if (res.data.message === "update successful") {
                    setError("success");
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            })

        return { ...rows, newData };
    }, [rows]);

    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const handleRowEditStart = (
        params: GridRowParams,
        event: MuiEvent<React.SyntheticEvent>,
    ) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        console.log(newRow);
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        updateData(newRow);
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="upload-form">
            <h2>All Data</h2>
            <div style={{ marginTop: "20px" }}>
                {loading && <CircularProgress />}
                {rows.length == 0 && !loading && <Alert severity="warning">No data found</Alert>}
                {error === "success" && <Alert severity="success">update successful</Alert>}
                {error !== "" && error !== "success" && <Alert severity="error">{error}</Alert>}
                {/* {rows !== undefined && rows.length > 0 && <DataGrid onRowEditStart={handleRowEditStart} onRowEditStop={handleRowEditStop} processRowUpdate={(params) => updateData(params)} rows={rows} columns={headers} onProcessRowUpdateError={((error: Error) => { console.log(error) })} />} */}

                {rows !== undefined && rows.length > 0 && <DataGrid 
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    rows={rows} columns={headers} />}

            </div>
        </div>
    );
}

export default Home;