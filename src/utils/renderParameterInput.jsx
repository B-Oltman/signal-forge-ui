import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { parameterTypeOptions } from './parameterTypeOptions';

export const renderParameterInput = (param, paramValue, handleParameterChange, paramLabel = null, disabled=false) => {
    paramLabel = paramLabel || param.name || param.key;
    const paramKey = paramLabel === 'Default' ? 'default' : param.key;    

    const valueTypeString = parameterTypeOptions.find(option => option.value === param.valueType)?.label || param.valueType;
    switch (valueTypeString) {
        case 'Index':
        case 'Integer':
            return (
                <TextField
                    key={paramKey}
                    name={paramKey}
                    label={paramLabel}
                    type="number"
                    value={paramValue}
                    disabled={disabled}
                    onChange={(e) => handleParameterChange(paramKey, parseFloat(e.target.value) || '')}
                    fullWidth                    
                />
            );
        case 'Float':
        case 'Double':
            return (
                <TextField
                    key={paramKey}
                    name={paramKey}
                    label={paramLabel}
                    type="number"
                    step="any"
                    value={paramValue}
                    disabled={disabled}
                    onChange={(e) => handleParameterChange(paramKey, parseFloat(e.target.value) || '')}
                    fullWidth                    
                />
            );
        case 'Boolean':
            return (
                <TextField
                    key={paramKey}
                    select
                    name={paramKey}
                    label={paramLabel}
                    value={paramValue}
                    disabled={disabled}
                    onChange={(e) => handleParameterChange(paramKey, e.target.value === 'true' || e.target.value === true)}
                    fullWidth                    
                >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                </TextField>
            );
        case 'CustomString':
            return (
                <TextField
                    key={paramKey}
                    name={paramKey}
                    label={paramLabel}
                    value={paramValue}
                    disabled={disabled}
                    onChange={(e) => handleParameterChange(paramKey, e.target.value)}
                    fullWidth                    
                />
            );
        default:
            return (
                <TextField
                    key={paramKey}
                    name={paramKey}
                    label={paramLabel}
                    value={paramValue}
                    disabled={disabled}
                    onChange={(e) => handleParameterChange(paramKey, e.target.value)}
                    fullWidth                    
                />
            );
    }
};
