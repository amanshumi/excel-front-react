import { useState, useEffect } from "react";
import * as xlsx from "xlsx";

import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Alert, CircularProgress } from "@mui/material";
import axios from "axios";

const headers: GridColDef[] = [
    { field: 'itemno', headerName: 'Item No.', width: 150 },
    { field: 'description', headerName: 'Description', width: 150 },
    { field: 'unit', headerName: 'Unit', width: 150 },
    { field: 'qty', headerName: 'Qty', width: 150 },
    { field: 'rate', headerName: 'Rate', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 120 }
]

const Upload = () => {
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: any) => {
        e.preventDefault();

        let file = e.target.files[0];

        if (file !== null && file !== undefined && file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return;
        }

        let reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onload = (ev) => {
            ev.preventDefault();

            const data = ev.target?.result;
            if (data === null || data === undefined) {
                return;
            }

            const workbook = xlsx.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData: Array<Object> = xlsx.utils.sheet_to_json(worksheet);

            if (jsonData.length < 1 || jsonData === null) {
                return;
            }

            const allRows = jsonData.slice(1);

            let newRows = [];

            for (let a = 0; a < 20; a++) {
                let newRowObj = {};
                let newList: Array<any>[] = [];

                Object.values(allRows[a]).forEach((singleTask) => {
                    newList.push(singleTask);
                });

                newRowObj = {
                    id: Math.random().toFixed(4),
                    itemno: newList[0] !== undefined ? newList[0] : '',
                    description: newList[1] !== undefined ? newList[1] : '',
                    unit: newList[2] !== undefined ? newList[2] : '',
                    qty: newList[3] !== undefined ? newList[3] : '',
                    rate: newList[4] !== undefined ? newList[4] : '',
                    amount: newList[5] !== undefined ? newList[5] : ''
                }

                newRows.push(newRowObj);
            }

            setRows(newRows);
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if(rows.length < 1) {
            return;
        }

        setLoading(true);
        setError("");

        await axios.post(`http://localhost:7000/api/v1/tasklist`, rows)
        .then((res) => {
            if(res.data && res.data.message === "task uploaded")
            setLoading(false);
            setError("success");
            setTimeout(() => {
                setError("");
                setRows([]);
            }, 1600);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
            setError("Something went wrong")
        })

        console.log(rows);
    }

    return (
        <div className="upload-form">
            <h2>Upload Excel</h2>
            {loading && <CircularProgress />}
            {error !== "" && error !== "success" && <Alert severity="error">{error}</Alert>}
            {error === "success" && <Alert severity="success">Upload successful</Alert>}
            <form style={{marginTop: "20px"}} onSubmit={handleSubmit}>

                <input type="file" name="excel" onInput={handleChange} />

                <button type="submit">upload</button>
            </form>
            <div>
                {rows !== undefined && rows.length > 0 && <DataGrid rows={rows} columns={headers} />}
            </div>
        </div>
    );
}

export default Upload;