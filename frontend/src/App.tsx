import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import ModelInfo from "./pages/ModelInfo";

import MainLayout from "./layouts/MainLayout";

function App() {

  return (

    <BrowserRouter>

      <MainLayout>

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/prediction"
            element={
              <Prediction />
            }
          />

          <Route
            path="/model"
            element={
              <ModelInfo />
            }
          />

        </Routes>

      </MainLayout>

    </BrowserRouter>

  );
}

export default App;