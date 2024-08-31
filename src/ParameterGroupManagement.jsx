import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid, Box } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import axiosInstance from '../axiosConfig';
import { renderParameterInput } from './utils/renderParameterInput.jsx';
import { parameterTypeOptions } from './utils/parameterTypeOptions.jsx';

const ParameterGroupManagement = ({ tradeSystemName, parameters }) => {
    const [parameterGroups, setParameterGroups] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [isAddingNew, setIsAddingNew] = useState(false); // State for adding new entry
    const [newParameterGroup, setNewParameterGroup] = useState({
        id: '',
        updatedId: '',
        tradeSystemName,
        lastUpdated: new Date(),
        parameters: {}
    });

    useEffect(() => {
        if (tradeSystemName) {
            const initialParameters = preprocessParameters(parameters);
            setNewParameterGroup(prev => ({
                ...prev,
                tradeSystemName,
                parameters: initialParameters
            }));            
            fetchParameterGroups(tradeSystemName);
        }
    }, [tradeSystemName, parameters]);

    const fetchParameterGroups = async (tradeSystemName) => {
        try {
            const response = await axiosInstance.get('/get-parameter-groups', {
                params: { tradeSystemName, includeMetadata: true }  // Add includeMetadata
            });
            setParameterGroups(response.data);  // Set the fetched parameter groups
        } catch (error) {
            console.error('Error fetching parameter groups:', error);
        }
    };

    const preprocessParameters = (parameters) => {
        return parameters.reduce((acc, param) => {
            acc[param.key] = {
                ...param,
                valueType: parameterTypeOptions.find(option => option.value === param.valueType)?.label,
                value: param.default || '',
            };
            return acc;
        }, {});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewParameterGroup((prev) => {
            if (name === "id") {
                // Only update the 'updatedId' field when 'id' changes and avoid resetting other parts of the state
                return { ...prev, id: value, updatedId: value };
            }
            return { ...prev, [name]: value };
        });
    };
    

    const handleParameterChange = (key, value) => {
        setNewParameterGroup((prev) => ({
            ...prev,
            parameters: {
                ...prev.parameters,
                [key]: {
                    ...prev.parameters[key],
                    value: value,
                },
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axiosInstance.post('/insert-parameter-group', newParameterGroup);
        fetchParameterGroups(tradeSystemName);  // Refresh the table after saving
        setIsAddingNew(false); // Reset add new state after submission
    };

    const handleDelete = async () => {
        if (newParameterGroup.id) {
            await axiosInstance.delete('/delete-parameter-group', {
                data: { id: newParameterGroup.id, tradeSystemName }
            });
            fetchParameterGroups(tradeSystemName);
            clearForm();
        }
    };

    const clearForm = () => {
        setNewParameterGroup({
            id: '',
            updatedId: '',
            tradeSystemName,
            lastUpdated: new Date(),
            parameters: preprocessParameters(parameters)
        });
        setRowSelection({});
        setIsAddingNew(false); // Reset add new state
    };

    useEffect(() => {
        const selectedRow = Object.keys(rowSelection)[0]; // Get the index of the selected row
        const selectedRowData = parameterGroups[selectedRow]; // Get the selected parameter group

        if (selectedRowData) {
            setNewParameterGroup({
                id: selectedRowData.id,
                updatedId: '',
                tradeSystemName: selectedRowData.tradeSystemName,
                lastUpdated: new Date(selectedRowData.lastUpdated),
                parameters: selectedRowData.parameters
            });
            setIsAddingNew(false); // Disable add new state when a row is selected
        } else {
            // Clear only the Group ID while keeping other inputs visible
            setNewParameterGroup(prev => ({
                ...prev,
                id: '',
                updatedId: '',
            }));
        }
    }, [rowSelection, parameterGroups]);

    const columns = [
        { accessorKey: 'id', header: 'Group ID' },
        { accessorKey: 'lastUpdated', header: 'Last Updated' },
    ];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Parameter Group Management for {tradeSystemName}
            </Typography>
            {!newParameterGroup.id && (<Button variant="contained" color="primary" onClick={() => setIsAddingNew(true)}>
                Add New Parameter Group
            </Button>)}
            {(newParameterGroup.id || isAddingNew) && (
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField                                
                                name="id"
                                label="Group ID"
                                value={newParameterGroup.updatedId || newParameterGroup.id || ''}  // Show updatedId or original ID
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Set Parameter Values</Typography>
                            {Object.keys(newParameterGroup?.parameters).map((key) => {
                                const param = newParameterGroup?.parameters[key];                            
                                const paramValue = newParameterGroup?.parameters[key].value;  // Ensure value is never undefined or null                        
                                return <Box key={key} sx={{ mt: 1 }}>{renderParameterInput(param, paramValue, handleParameterChange)}</Box>;
                            })}
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
                        Save
                    </Button>
                    {newParameterGroup.id && (
                        <Button variant="contained" color="secondary" style={{ marginTop: 20, marginLeft: 20 }} onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                </form>
            )}
            <Paper style={{ marginTop: 20, padding: 20 }}>
                <Typography variant="h6">Existing Parameter Groups</Typography>
                <MaterialReactTable
                    columns={columns}
                    data={parameterGroups}
                    enableRowSelection
                    enableMultiRowSelection={false} // Allow only single row selection
                    onRowSelectionChange={setRowSelection}
                    state={{ rowSelection }}
                    initialState={{ sorting: [{ id: 'lastUpdated', desc: true }] }} // Set default sorting by 'Last Updated' descending
                />
            </Paper>
        </Container>
    );
};

export default ParameterGroupManagement;
