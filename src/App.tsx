import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Appointments, Appointment, Doctors, Home, Profile } from './pages';
import { Footer, Navbar } from '@/components';
import { PrivateRoute } from './router/PrivateRoute';
import { useRedirect } from './context/redirect';

const App = () => {
    const navigate = useNavigate();
    const { to, setTo } = useRedirect();

    useEffect(() => {
        if (to) {
            navigate(to);
            setTo(null);
        }
    }, [to, navigate, setTo]);

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
