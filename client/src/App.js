import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing, Login, Error, ProtectedRoute } from "./pages";
import {
  Employee,
  Alljobs,
  Profile,
  SharedLayout,
  Stats,
  Admin
} from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route exact path="employee" element={<Employee />}></Route>
          <Route exact path="all-jobs" element={<Alljobs />}></Route>
          <Route exact path="profile" element={<Profile />}></Route>
          <Route exact path="admin" element={<Admin />}></Route>
          <Route exact path="" element={<Stats />}></Route>
        </Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="*" element={<Error />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
