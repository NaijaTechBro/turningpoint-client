import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import PatientResults from './pages/PatientResults';
import TestMenu from './pages/TestMenu';
import AboutPage from './pages/AboutPage';
import Contact from './pages/Contact';

// Auth & Protected Pages
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import AllPatients from './pages/receptionist/AllPatients';
import EditPatient from './pages/receptionist/Editpatients';
import RegisterPatient from './pages/receptionist/RegisterPatient';
import PatientDetails from './pages/receptionist/PatientDetails';
import LabQueue from './pages/scientist/LabQueue';
import EnterResult from './pages/scientist/EnterResult';
import OrderTest from './pages/receptionist/OrderTest';
import TestOrders from './pages/receptionist/TestOrders';

// Inside <Routes>

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<PatientResults />} />
          <Route path="/test-menu" element={<TestMenu />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          <Route 
  path="/receptionist/dashboard" 
  element={
    <ProtectedRoute allowedRoles={['Receptionist', 'Admin']}>
      <DashboardLayout title="Reception Desk">
        <ReceptionistDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  } 
/>
<Route 
  path="/receptionist/patients" 
  element={
    <ProtectedRoute allowedRoles={['Receptionist', 'Admin']}>
      <DashboardLayout title="Patient Directory">
        <AllPatients />
      </DashboardLayout>
    </ProtectedRoute>
  } 
/>

<Route 
  path="/receptionist/order-test/:patientId" 
  element={
    <ProtectedRoute allowedRoles={['Receptionist', 'Admin']}>
      <DashboardLayout title="Order Test">
        <OrderTest />
      </DashboardLayout>
    </ProtectedRoute>
  } 
/>

<Route 
  path='/receptionist/test-orders'
  element={
    <ProtectedRoute allowedRoles={['Receptionist', 'Admin']}>
      <DashboardLayout title="Test Orders">
        <TestOrders />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>


<Route 
  path="/scientist/dashboard" 
  element={
    <ProtectedRoute allowedRoles={['LabScientist', 'Admin']}>
      <DashboardLayout title="Laboratory Engine">
        <LabQueue />
      </DashboardLayout>
    </ProtectedRoute>
  } 
/>
<Route 
  path="/scientist/enter-result/:labRef" 
  element={
    <ProtectedRoute allowedRoles={['LabScientist', 'Admin']}>
      <DashboardLayout title="Results Processing">
        <EnterResult />
      </DashboardLayout>
    </ProtectedRoute>
  } 
/>

<Route 
  path="/receptionist/register" 
  element={
    <ProtectedRoute allowedRoles={['Receptionist', 'Admin']}>
      <DashboardLayout title="Register New Patient">
        <RegisterPatient />
      </DashboardLayout>
    </ProtectedRoute>
  } 
/>

<Route 
  path="/receptionist/edit-patient/:id" 
  element={
    <ProtectedRoute allowedRoles={['Receptionist', 'Admin']}>
      <DashboardLayout title="Edit Patient">
        <EditPatient />
      </DashboardLayout>
    </ProtectedRoute>
  } 
/>

<Route 
  path="/receptionist/patient-details/:id" 
  element={
    <ProtectedRoute allowedRoles={['Receptionist', 'Admin']}>
      <DashboardLayout title="Patient Details">
        <PatientDetails />
      </DashboardLayout>
    </ProtectedRoute>
  } 
/>
          {/* --- Protected Admin Routes --- */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Placeholders for other roles */}
          <Route path="/scientist/dashboard" element={<ProtectedRoute allowedRoles={['LabScientist', 'Admin']}><div className="p-10">Scientist Dashboard</div></ProtectedRoute>} />
          <Route path="/receptionist/dashboard" element={<ProtectedRoute allowedRoles={['Receptionist', 'Admin']}><div className="p-10">Receptionist Dashboard</div></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;