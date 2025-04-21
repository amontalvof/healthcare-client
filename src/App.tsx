import { Route, Routes } from 'react-router';
import {
    Appointments,
    Appointment,
    Doctors,
    Home,
    Profile,
    Billing,
} from './pages';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <div className="mx-4 sm:mx-[10%]">
            <Navbar />
            <Routes>
                <Route index element={<Home />} />
                <Route path="doctors">
                    <Route index element={<Doctors />} />
                    <Route path=":specialty" element={<Doctors />} />
                </Route>
                <Route path="appointments">
                    <Route index element={<Appointments />} />
                    <Route path=":docId" element={<Appointment />} />
                </Route>
                <Route path="billing" element={<Billing />} />
                <Route path="profile" element={<Profile />} />
            </Routes>
        </div>
    );
};

export default App;
