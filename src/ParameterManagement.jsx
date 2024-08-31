import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid, MenuItem } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import axiosInstance from '../axiosConfig';
import { renderParameterInput } from './utils/renderParameterInput.jsx';
import { parameterTypeOptions } from './utils/parameterTypeOptions.jsx';

const ParameterManagement = ({ tradeSystemName }) => {
    const [parameters, setParameters] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [selectedParameter, setSelectedParameter] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false); // State for adding new entry
    const [newParameter, setNewParameter] = useState({
        key: '',
        name: '',
        tradeSystemName,
        valueType: 'Integer',
        default: '',
        minValue: '',
        maxValue: '',
        options: [],
        restrictAutoTuning: false,
        displayOrder: 0
    });

    useEffect(() => {
        if (tradeSystemName) {
            fetchParameters();
        }
    }, [tradeSystemName]);

    const fetchParameters = async () => {
        try {
            const response = await axiosInstance.get('/get-parameters', {
                params: { tradeSystemName }
            });
            setParameters(preprocessParameter(response.data) || []);
        } catch (error) {
            console.error('Error fetching parameters:', error);
            setParameters([]);
        }
    };

    useEffect(() => {
        const selectedRow = Object.keys(rowSelection || {})[0];
        const selectedRowData = parameters[selectedRow];

        if (selectedRowData) {
            setSelectedParameter(selectedRowData);
            setNewParameter(selectedRowData);
            setIsAddingNew(false); // Disable add new state when a row is selected
        } else {
            setSelectedParameter(null);
            clearForm();
        }
    }, [rowSelection, parameters]);

    const handleChange = (key, value) => {        
        setNewParameter((prev) => ({ ...prev, [key]: value }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value === '' ? '' : parseFloat(value);
        setNewParameter((prev) => ({ ...prev, [name]: numericValue }));
    };

    const preprocessParameter = (parameter) => {
        return parameter.map(parameter => ({
            ...parameter,
            valueType: parameterTypeOptions.find(option => option.value === parameter.valueType)?.label,
        }));
    };

    const postprocessParameter = (parameter) => {
        return {
            ...parameter,
            minValue: parameter.minValue || null,
            maxValue: parameter.maxValue || null,
            valueType: parameterTypeOptions.find(option => option.label === parameter.valueType)?.value,
            options: Array.isArray(parameter.options)
                ? parameter.options
                : parameter.options
                    ? parameter.options.split(',')
                    : [],
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const preprocessedParameter = postprocessParameter(newParameter);

        if (selectedParameter) {
            const updatedParameter = { ...preprocessedParameter, updatedKey: selectedParameter.key };
            await axiosInstance.put('/update-parameter', updatedParameter);
        } else {
            await axiosInstance.post('/insert-parameter', preprocessedParameter);
        }

        fetchParameters();
        clearForm();
    };

    const clearForm = () => {
        setNewParameter({
            key: '',
            name: '',
            tradeSystemName,
            valueType: 'Integer',
            default: '',
            minValue: '',
            maxValue: '',
            options: [],
            restrictAutoTuning: false,
            displayOrder: 0
        });
        setSelectedParameter(null);
        setIsAddingNew(false); // Reset add new state
    };

    const handleDelete = async () => {
        if (selectedParameter) {
            await axiosInstance.delete('/delete-parameter', {
                data: { key: selectedParameter.key, tradeSystemName }
            });
            fetchParameters();
            clearForm();
        }
    };

    const columns = [
        { accessorKey: 'key', header: 'Key' },
        { accessorKey: 'name', header: 'Name' },
        {
            accessorKey: 'valueType',
            header: 'Value Type',
            format: (value) => {
                const valueType = value;
                const typeLabel = parameterTypeOptions.find(option => option.value === valueType)?.label;
                return typeLabel || 'Unknown';
            },
        },
        { accessorKey: 'default', header: 'Default Value' },
        { accessorKey: 'minValue', header: 'Min Value' },
        { accessorKey: 'maxValue', header: 'Max Value' },
    ];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Parameter Management for {tradeSystemName}
            </Typography>
            {!selectedParameter && !isAddingNew && (<Button variant="contained" color="primary" onClick={() => setIsAddingNew(true)}>
                Add New Parameter
            </Button>)}
            {(selectedParameter || isAddingNew) && (
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                name="key" 
                                label="Key" 
                                value={newParameter.key} 
                                onChange={(e) => handleChange('key', e.target.value)} 
                                fullWidth 
                                required 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                name="name" 
                                label="Name" 
                                value={newParameter.name} 
                                onChange={(e) => handleChange('name', e.target.value)} 
                                fullWidth 
                                disabled={!newParameter.key} // Disable if key is empty
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                name="valueType"
                                label="Value Type"
                                value={newParameter.valueType}
                                onChange={(e) => handleChange('valueType', e.target.value)}
                                fullWidth
                                disabled={!newParameter.key} // Disable if key is empty
                            >
                                {parameterTypeOptions.map(option => (
                                    <MenuItem key={option.label} value={option.label}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {renderParameterInput(newParameter, newParameter.default, handleChange, "Default", !newParameter.key)} 
                        </Grid>
                        {['Float', 'Index', 'Integer', 'Double'].includes(newParameter.valueType) && (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        name="minValue" 
                                        label="Min Value" 
                                        type="number" 
                                        value={newParameter.minValue} 
                                        onChange={handleNumberChange} 
                                        fullWidth 
                                        disabled={!newParameter.key} // Disable if key is empty
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        name="maxValue" 
                                        label="Max Value" 
                                        type="number" 
                                        value={newParameter.maxValue} 
                                        onChange={handleNumberChange} 
                                        fullWidth 
                                        disabled={!newParameter.key} // Disable if key is empty
                                    />
                                </Grid>
                            </>
                        )}
                        {newParameter.valueType === 'CustomString' && (
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    name="options" 
                                    label="Options (comma separated)" 
                                    value={newParameter.options} 
                                    onChange={(e) => handleChange('options', e.target.value)} 
                                    fullWidth 
                                    disabled={!newParameter.key} // Disable if key is empty
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                name="displayOrder" 
                                label="Display Order" 
                                type="number" 
                                value={newParameter.displayOrder} 
                                onChange={handleNumberChange} 
                                fullWidth 
                                disabled={!newParameter.key} // Disable if key is empty
                            />
                        </Grid>
                    </Grid>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        style={{ marginTop: 20 }} 
                        disabled={!newParameter.key} // Disable save button if key is empty
                    >
                        {'Save'}
                    </Button>
                    {selectedParameter && (
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            style={{ marginTop: 20, marginLeft: 20 }} 
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    )}
                </form>
            )}
            <Paper style={{ marginTop: 20, padding: 20 }}>
                <Typography variant="h6">Existing Parameters</Typography>
                <MaterialReactTable
                    columns={columns}
                    data={parameters}
                    enableRowSelection
                    enableMultiRowSelection={false}
                    onRowSelectionChange={setRowSelection}
                    state={{ rowSelection }}
                    initialState={{ sorting: [{ id: 'key', asc: true }] }} // Set default sorting by 'Key' ascending
                />
            </Paper>
        </Container>
    );
};

export default ParameterManagement;
