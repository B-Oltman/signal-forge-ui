import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import ParameterManagement from './ParameterManagement';
import ParameterGroupManagement from './ParameterGroupManagement';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/parameters" element={<ParameterManagement />} />
                <Route path="/parameter-groups" element={<ParameterGroupManagement />} />
            </Routes>
        </Router>
    );
};

export default App;
