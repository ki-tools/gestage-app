import React, { useState, useMemo } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { COEFS } from '../consts';
import getPred from "../models";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <div style={{flex: 1}}></div>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Lookups({ mod }) {
  const [gagelmp, setGagelmp] = useState(280);
  const [birthhc, setBirthhc] = useState(35);
  const handleChange = (event) => {
    if (mod === 'c') {
      setGagelmp(event.target.value);
    } else {
      setBirthhc(event.target.value);
    }
  };

  const opts = useMemo(() => {
    if (mod === 'c') {
      return Object.keys(COEFS.c).map((d) => Number(d.substring(1)));
    } else {
      return Object.keys(COEFS.d).map((d) => Number(d.substring(1) / 10));
    }
  }, [mod]);

  const curVal = useMemo(() => mod === 'c' ? gagelmp : birthhc, [mod, gagelmp, birthhc]);

  const rows = useMemo(() => {
    const res = new Array(81);
    for (let ii = 0; ii < res.length; ii++) {
      const birthwt = 1000 + ii * 50;
      res[ii] = {
        id: ii,
        val: curVal,
        birthwt,
        ga: (Math.round(100 * getPred(mod, curVal, birthwt, false)) / 100).toFixed(2)
      }
    }
    return res;
  }, [mod, curVal]);

  const columns = [
    { field: 'val', headerName: mod === 'c' ? 'LMP' : 'birthhc', flex: 1 },
    { field: 'birthwt', headerName: 'birthwt', flex: 1 },
    { field: 'ga', headerName: 'ga', flex: 1 },
  ];

  const label = mod === 'c' ? 'Gestational age LMP' : 'Birth Head Circumference';

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', mb: 5}}>
      <Box sx={{pb: 1}}>
        <FormControl variant="outlined" sx={{ minWidth: '20ch' }} size="small">
          <InputLabel id="select-tab-val-label">{label}</InputLabel>
          <Select
            labelId="select-tab-val-label"
            id="select-tab-val"
            value={mod === 'c' ? gagelmp : birthhc}
            onChange={handleChange}
            label={label}
          >
            {opts.map((d) => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box style={{ height: 500, width: '100%' }}>
        <DataGrid rowHeight={35} rows={rows} columns={columns} sx={{fontFamily: "'Source Code Pro', monospace"}} slots={{
          toolbar: CustomToolbar,
        }} />
      </Box>
    </Box>
  )
}
