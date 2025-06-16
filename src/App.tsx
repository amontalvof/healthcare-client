import { Route, Routes } from 'react-router-dom';
import {
    Appointments,
    Appointment,
    Doctors,
    Home,
    Profile,
    Billing,
} from './pages';
import { Footer, Navbar } from '@/components';
import { PrivateRoute } from './router/PrivateRoute';

const App = () => {
    return (
        <div>
            <Navbar />
            <div className="mx-4 sm:mx-[10%] flex flex-col min-h-screen">
                <main className="flex-grow">
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="doctors">
                            <Route index element={<Doctors />} />
                            <Route path=":specialty" element={<Doctors />} />
                        </Route>
                        <Route element={<PrivateRoute />}>
                            <Route path="appointments">
                                <Route index element={<Appointments />} />
                                <Route
                                    path=":docId"
                                    element={<Appointment />}
                                />
                            </Route>
                            <Route path="billing" element={<Billing />} />
                            <Route path="profile" element={<Profile />} />
                        </Route>
                    </Routes>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default App;
