import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import ModelInfo from "./pages/ModelInfo";

import MainLayout from "./layouts/MainLayout";
import Analytics from "./pages/Analytics";
import StockAnalysis from "./pages/StockAnalysis";

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

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/analysis"
            element={
              <StockAnalysis />
            }
          />

        </Routes>

      </MainLayout>

    </BrowserRouter>

  );
}

export default App;