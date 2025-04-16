import { Route, Routes } from 'react-router';
import {
    About,
    Appointments,
    Appointment,
    Contact,
    Doctors,
    Home,
    Login,
    Profile,
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
                <Route path="login" element={<Login />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="profile" element={<Profile />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="appointment/docId" element={<Appointment />} />
            </Routes>
        </div>
    );
};

export default App;
