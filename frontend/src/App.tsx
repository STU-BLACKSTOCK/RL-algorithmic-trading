import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ErrorBoundary from "./components/ui/ErrorBoundary";

import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import ModelInfo from "./pages/ModelInfo";
import Analytics from "./pages/Analytics";
import StockAnalysis from "./pages/StockAnalysis";
import History from "./pages/History";
import PaperTrading from "./pages/PaperTrading";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/paper-trading" element={<PaperTrading />} />
            <Route path="/model" element={<ModelInfo />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/analysis" element={<StockAnalysis />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </MainLayout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
