import { Dashboard } from '../pages/Dashboard/Dashboard';
import AppointmentManagement from '../pages/AppointmentManagement/AppointmentManagement';
import CreateAppointment from '../pages/CreateAppointment/CreateAppointment';
import { Landing } from '../pages/Landing/Landing';
import { Login } from '../pages/Login/Login';
import NotFound from '../pages/NotFound/NotFound';
import { Routes, Route } from 'react-router-dom';
import { NewPatient } from '../pages/PatientManagement/NewPatient';
import PatientsList from '../pages/PatientManagement/PatientsList';
import { SeeEditPatient } from '../pages/PatientManagement/SeeEditPatient';
import { ForgotPassword } from '../pages/Login/ForgotPassword';
import { ResetPassword } from '../pages/Login/ResetPassword';

import PrivateRoute from '../guards/PrivateRoute';
import UsersList from '../pages/UsersManagement/UsersList';
import { EditUserInfo } from '../pages/UserManagement/EditUserInfo';
import CreateUser from '../pages/UserManagement/CreateUser';
import Reports from '../pages/Reports/Reports';
import { AuthProvider } from '../../Features/contexts/AuthContext';

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/reset-password" element={<ResetPassword />} />
          <Route path="/*" element={<NotFound />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<AppointmentManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route
              path="/patient-management/new-patient"
              element={<NewPatient />}
            />

            <Route
              path="/patient-management/patients-list"
              element={<PatientsList />}
            />
            <Route
              path="/patient-management/seeEditPatient/:id"
              element={<SeeEditPatient />}
            />
            <Route
              path="/users-management/users-list"
              element={<UsersList />}
            />
            <Route
              path="/create-appointment"
              element={<CreateAppointment />}></Route>
            <Route path="/user/create-user" element={<CreateUser />}></Route>

            <Route
              path="/patient-management/patients-list"
              element={<PatientsList />}
            />
            <Route
              path="/patient-management/seeEditPatient/:id"
              element={<SeeEditPatient />}
            />
            <Route
              path="/user-management/edit-user/:id"
              element={<EditUserInfo />}
            />
            <Route
              path="/users-management/users-list"
              element={<UsersList />}
            />
            <Route
              path="/patient-management/patients-list"
              element={<PatientsList />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
