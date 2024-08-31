import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Button, TextField, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import axiosInstance from '../axiosConfig';
import ParameterManagement from './ParameterManagement';
import ParameterGroupManagement from './ParameterGroupManagement';

const daysOfWeek = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
];

const barTypes = [
    { label: 'Seconds Per Bar', value: 's', description: '10s for 10 seconds per bar.', periodCount: 1 },
    { label: 'Minutes Per Bar', value: 'm', description: '15m for 15 minutes per bar.', periodCount: 1 },
    { label: 'Hours Per Bar', value: 'h', description: '1h for 1 hour per bar.', periodCount: 1 },
    { label: 'Trades Per Bar', value: 't', description: '100t for 100 trades per bar.', periodCount: 1 },
    { label: 'Volume Per Bar', value: 'v', description: '100000v for 100,000 shares/contracts per bar.', periodCount: 1 },
    { label: 'Range Per Bar (Standard range bars)', value: 'r', description: '4r for 4 ticks per bar.', periodCount: 1 },
    { label: 'Range Per Bar (New bar on range met)', value: 'rm', description: '4rm for 4 ticks per bar with a new bar on range met.', periodCount: 1 },
    { label: 'Range Per Bar (True range bars)', value: 'rt', description: '4rt for 4 ticks per true range bar.', periodCount: 1 },
    { label: 'Range Per Bar (Fill gaps)', value: 'rf', description: '4rf for 4 ticks per bar with gap filling.', periodCount: 1 },
    { label: 'Range Per Bar (Open = close)', value: 'ro', description: '4ro for 4 ticks per bar where open equals close.', periodCount: 1 },
    { label: 'Range Per Bar (New bar on range met and Open = close)', value: 'rmo', description: '4rmo for 4 ticks per bar with new bar on range met and open equals close.', periodCount: 1 },
    { label: 'Reversal Bar', value: 'rv', description: '5-10rv for 5 tick reversal with a minimum length of 10 ticks.', periodCount: 2 },
    { label: 'Renko Bar', value: 'rk', description: '4rk for Renko bars with 4 tick size.', periodCount: 1 },
    { label: 'Flex Renko Bar', value: 'fr', description: '4-2-2fr for Flex Renko bars with BoxSize of 4, TrendOffset of 2, and RevOffset of 2.', periodCount: 3 },
    { label: 'Aligned Renko', value: 'ar', description: '4ar for Aligned Renko bars with 4 tick size.', periodCount: 1 },
    { label: 'Delta Volume Per Bar', value: 'dv', description: '1000dv for 1,000 delta volume per bar.', periodCount: 1 },
    { label: 'Price Changes Per Bar', value: 'pc', description: '10pc for 10 price changes per bar.', periodCount: 1 },
    { label: 'Days Per Bar', value: 'd', description: '1d for 1 day per bar.', periodCount: 1 },
    { label: 'Weeks Per Bar', value: 'w', description: '1w for 1 week per bar.', periodCount: 1 },
    { label: 'Months Per Bar', value: 'mn', description: '1mn for 1 month per bar.', periodCount: 1 },
    { label: 'Quarters Per Bar', value: 'q', description: '1q for 1 quarter per bar.', periodCount: 1 },
    { label: 'Years Per Bar', value: 'y', description: '1y for 1 year per bar.', periodCount: 1 },
    { label: 'Flex Renko Inverse Setting Bar', value: 'fri', description: '4-2-2fri for Flex Renko Inverse bars with BarSize of 4, TrendBarOffset of 2, and ReversalBarTrigger of 2.', periodCount: 3 },
    { label: 'Point and Figure', value: 'pf', description: '1-5pf for Point and Figure bars with BoxSize of 1 and ReversalSize of 5.', periodCount: 2 },
    { label: 'Point and Figure (Alternative)', value: 'pnf', description: '1-5pnf for Point and Figure bars with BoxSize of 1 and ReversalSize of 5.', periodCount: 2 },
];

const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description' },
];

const updateIntervalTypes = [
    { label: 'New Bar', value: 0 },
    { label: 'Always', value: 1 },
];


const timePattern = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"; // Regex for HH:MM format

const TradingSystemManagement = () => {
    const [tradingSystems, setTradingSystems] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [isAddMode, setIsAddMode] = useState(false);  // Track if adding a new system
    const [newTradingSystem, setNewTradingSystem] = useState({
        name: '',
        updatedName: null,
        description: '',
        sessionSettings: {
            barType: '',
            barPeriods: [''],
            updateIntervalType: 'New_Bar', // Default value
            tradingWindow: {},
        },
        systemSettings: {
            enableLogging: true,
            liveResultsSnapshotIntervalMinutes: 10,
        },
    });
    const [rowSelection, setRowSelection] = useState({});
    const [selectedTradingSystem, setSelectedTradingSystem] = useState(null);

    useEffect(() => {
        fetchTradingSystems();
    }, []);

    const fetchTradingSystems = async () => {
        const response = await axiosInstance.get('/get-trading-systems');
        setTradingSystems(response.data);
    };

    const handleAddTradingSystem = async () => {
        // Concatenate barPeriods into a single string
        const barPeriodString = newTradingSystem.sessionSettings.barPeriods.join('-');

        // Ensure updateIntervalType is sent as an integer as expected by the backend
        const updatedSystem = {
            ...newTradingSystem,
            sessionSettings: {
                ...newTradingSystem.sessionSettings,
                barPeriod: barPeriodString, // Concatenate barPeriods into a string
            },
        };

        // Check if we are updating an existing trading system or adding a new one
        if (selectedTradingSystem) {
            await axiosInstance.post('/add-trading-system', updatedSystem);
        } else {
            await axiosInstance.post('/add-trading-system', updatedSystem);
        }

        // Reset form after saving
        setNewTradingSystem({
            name: '',
            updatedName: null,
            description: '',
            sessionSettings: {
                barType: '',
                barPeriods: [''],
                updateIntervalType: 0, // Default to New_Bar
                tradingWindow: {},
            },
            systemSettings: {
                enableLogging: true,
                liveResultsSnapshotIntervalMinutes: 10,
            },
        });

        setIsAddMode(false);
        fetchTradingSystems();
    };

    const handleDeleteTradingSystem = async () => {
        if (selectedTradingSystem) {
            await axiosInstance.delete('/delete-trading-system', {
                data: { name: selectedTradingSystem.name },
            });
            setNewTradingSystem({
                name: '',
                updatedName: null,
                description: '',
                sessionSettings: {
                    barType: '',
                    barPeriods: [''],
                    updateIntervalType: 'New_Bar',
                    tradingWindow: {},
                },
                systemSettings: {
                    enableLogging: true,
                    liveResultsSnapshotIntervalMinutes: 10,
                },
            });
            setIsAddMode(false);
            fetchTradingSystems();
        }
    };

    const handleDayToggle = (day) => {
        setNewTradingSystem((prev) => ({
            ...prev,
            sessionSettings: {
                ...prev.sessionSettings,
                tradingWindow: {
                    ...prev.sessionSettings.tradingWindow,
                    [day]: prev.sessionSettings.tradingWindow[day]
                        ? null
                        : { startTime: '08:30', endTime: '15:00' },
                },
            },
        }));
    };

    const handleTimeChange = (day, field, value) => {
        setNewTradingSystem((prev) => ({
            ...prev,
            sessionSettings: {
                ...prev.sessionSettings,
                tradingWindow: {
                    ...prev.sessionSettings.tradingWindow,
                    [day]: {
                        ...prev.sessionSettings.tradingWindow[day],
                        [field]: value,
                    },
                },
            },
        }));
    };

    const handleBarPeriodChange = (index, value) => {
        const updatedBarPeriods = [...newTradingSystem.sessionSettings.barPeriods];
        updatedBarPeriods[index] = value;
        setNewTradingSystem((prev) => ({
            ...prev,
            sessionSettings: {
                ...prev.sessionSettings,
                barPeriods: updatedBarPeriods,
            },
        }));
    };

    const renderBarPeriodInputs = () => {
        const selectedBarType = barTypes.find(type => type.value === newTradingSystem.sessionSettings.barType);
        const periodCount = selectedBarType ? selectedBarType.periodCount : 1;
        const barPeriods = newTradingSystem.sessionSettings.barPeriods || Array(periodCount).fill('');

        return Array.from({ length: periodCount }).map((_, index) => (
            <Grid item xs={12 / periodCount} key={index}>
                <TextField
                    label={`Bar Period ${index + 1}`}
                    type="number"
                    value={barPeriods[index]}
                    onChange={(e) => handleBarPeriodChange(index, e.target.value)}
                    fullWidth
                />
            </Grid>
        ));
    };

    useEffect(() => {
        const selectedRow = Object.keys(rowSelection)[0];
        const selectedRowData = tradingSystems[selectedRow];

        if (selectedRowData) {
            const selectedBarType = barTypes.find(type => type.value === selectedRowData.sessionSettings.barType);
            const periodCount = selectedBarType ? selectedBarType.periodCount : 1;
            const barPeriods = selectedRowData.sessionSettings.barPeriod.split('-').slice(0, periodCount);

            setSelectedTradingSystem(selectedRowData);
            setNewTradingSystem({
                name: selectedRowData.name,
                updatedName: null,
                description: selectedRowData.description,
                sessionSettings: {
                    ...selectedRowData.sessionSettings,
                    barPeriods,
                    updateIntervalType: selectedRowData.sessionSettings.updateIntervalType, // Should already be an integer
                },
                systemSettings: selectedRowData.systemSettings || {
                    enableLogging: true,
                    liveResultsSnapshotIntervalMinutes: 10,
                },
            });
        } else {
            setSelectedTradingSystem(null);
            setNewTradingSystem({
                name: '',
                updatedName: null,
                description: '',
                sessionSettings: {
                    barType: '',
                    barPeriods: [''],
                    updateIntervalType: 0, // Default to New_Bar
                    tradingWindow: {},
                },
                systemSettings: {
                    enableLogging: true,
                    liveResultsSnapshotIntervalMinutes: 10,
                },
            });
        }
    }, [rowSelection, tradingSystems]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Trading System Management
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setIsAddMode(true);
                    setSelectedTradingSystem(null);
                    setNewTradingSystem({
                        name: '',
                        updatedName: null,
                        description: '',
                        sessionSettings: {
                            barType: '',
                            barPeriods: [''],
                            updateIntervalType: 'New_Bar',
                            tradingWindow: {},
                        },
                        systemSettings: {
                            enableLogging: true,
                            liveResultsSnapshotIntervalMinutes: 10,
                        },
                    });
                }}
            >
                Add New Trading System
            </Button>

            {(isAddMode || selectedTradingSystem) && (
                <Grid container spacing={2} style={{ marginTop: 20 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            value={selectedTradingSystem ? newTradingSystem?.updatedName || newTradingSystem.name : newTradingSystem.name}
                            onChange={(e) => {
                                let updatedTradingSystem = {};

                                if (selectedTradingSystem) {
                                    updatedTradingSystem = { ...newTradingSystem, updatedName: e.target.value };
                                } else {
                                    updatedTradingSystem = { ...newTradingSystem, name: e.target.value };
                                }

                                setNewTradingSystem(updatedTradingSystem);
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Description"
                            value={newTradingSystem.description}
                            onChange={(e) => setNewTradingSystem({ ...newTradingSystem, description: e.target.value })}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6">Session Settings</Typography>
                        <Grid item xs={5.9} sx={{py: 2}}>
                            <TextField
                                select
                                label="Update Interval Type"
                                value={newTradingSystem.sessionSettings.updateIntervalType}
                                onChange={(e) => setNewTradingSystem({
                                    ...newTradingSystem,
                                    sessionSettings: {
                                        ...newTradingSystem.sessionSettings,
                                        updateIntervalType: parseInt(e.target.value, 10),
                                    }
                                })}
                                SelectProps={{
                                    native: true,
                                }}
                                fullWidth
                            >
                                {updateIntervalTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    label="Bar Type"
                                    value={newTradingSystem.sessionSettings.barType}
                                    onChange={(e) => {
                                        const selectedBarType = barTypes.find(type => type.value === e.target.value);
                                        const periodCount = selectedBarType ? selectedBarType.periodCount : 1;
                                        setNewTradingSystem({
                                            ...newTradingSystem,
                                            sessionSettings: {
                                                ...newTradingSystem.sessionSettings,
                                                barType: e.target.value,
                                                barPeriods: Array(periodCount).fill(''),
                                            }
                                        });
                                    }}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    fullWidth
                                >
                                    <option value=""></option>
                                    {barTypes.map((type) => (
                                        <option key={type.label} value={type.value} title={type.description}>
                                            {type.label}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            {renderBarPeriodInputs()}
                        </Grid>

                        <Grid container spacing={2}>
                            {daysOfWeek.map((day) => (
                                <Grid item xs={12} sm={6} key={day.value}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={Boolean(newTradingSystem.sessionSettings.tradingWindow[day.value])}
                                                onChange={() => handleDayToggle(day.value)}
                                            />
                                        }
                                        label={day.label}
                                    />
                                    {newTradingSystem.sessionSettings.tradingWindow[day.value] && (
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Start Time"
                                                    type="time"
                                                    value={newTradingSystem.sessionSettings.tradingWindow[day.value]?.startTime || ''}
                                                    onChange={(e) => handleTimeChange(day.value, 'startTime', e.target.value)}
                                                    inputProps={{
                                                        step: 300, // 5 minutes step
                                                    }}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="End Time"
                                                    type="time"
                                                    value={newTradingSystem.sessionSettings.tradingWindow[day.value]?.endTime || ''}
                                                    onChange={(e) => handleTimeChange(day.value, 'endTime', e.target.value)}
                                                    inputProps={{
                                                        step: 300, // 5 minutes step
                                                    }}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6">System Settings</Typography>

                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={newTradingSystem.systemSettings.enableLogging}
                                        onChange={(e) => setNewTradingSystem({
                                            ...newTradingSystem,
                                            systemSettings: {
                                                ...newTradingSystem.systemSettings,
                                                enableLogging: e.target.checked,
                                            },
                                        })}
                                    />
                                }
                                label="Enable Debug Logging"
                            />
                        </FormGroup>

                        <TextField
                            label="Live Results Snapshot Interval (Minutes)"
                            type="number"
                            value={newTradingSystem.systemSettings.liveResultsSnapshotIntervalMinutes}
                            onChange={(e) => setNewTradingSystem({
                                ...newTradingSystem,
                                systemSettings: {
                                    ...newTradingSystem.systemSettings,
                                    liveResultsSnapshotIntervalMinutes: e.target.value,
                                },
                            })}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleAddTradingSystem} fullWidth>
                            Save
                        </Button>
                        {selectedTradingSystem && (
                            <Button variant="contained" color="secondary" onClick={handleDeleteTradingSystem} fullWidth style={{ marginTop: 10 }}>
                                Delete
                            </Button>
                        )}
                    </Grid>
                </Grid>
            )}

            <Paper style={{ marginTop: 20 }}>
                <MaterialReactTable
                    columns={columns}
                    data={tradingSystems}
                    enableRowSelection
                    enableMultiRowSelection={false} // To enable single row selection only
                    onRowSelectionChange={setRowSelection}
                    state={{ rowSelection }}
                    initialState={{ sorting: [{ id: 'name', asc: true }], density: 'compact' }}
                />
            </Paper>

            {selectedTradingSystem && (
                <div>
                    <Paper style={{ marginTop: 20, padding: 20 }}>
                        <ParameterManagement tradeSystemName={selectedTradingSystem.name} parameters={parameters} />
                    </Paper>
                    <Paper style={{ marginTop: 20, padding: 20 }}>
                        <ParameterGroupManagement tradeSystemName={selectedTradingSystem.name} parameters={parameters} />
                    </Paper>
                </div>
            )}
        </Container>
    );
};

export default TradingSystemManagement;
