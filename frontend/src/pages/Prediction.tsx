import { useState } from "react";

import api from "../services/api";

import type {
  PredictionResponse
} from "../types/prediction";

function Prediction() {

  const [ticker, setTicker] =
    useState("AAPL");

  const [prediction,
    setPrediction] =
    useState<
      PredictionResponse | null
    >(null);

  const [loading,
    setLoading] =
    useState(false);

  const handlePredict =
    async () => {

      try {

        setLoading(true);

        const response =
          await api.post(
            "/predict",
            {
              ticker
            }
          );

        setPrediction(
          response.data
        );

      } catch (error) {

        console.error(
          error
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div>

      <h1>
        Trading Prediction
      </h1>

      <select
        value={ticker}
        onChange={(e) =>
          setTicker(
            e.target.value
          )
        }
      >

        <option>
          AAPL
        </option>

        <option>
          MSFT
        </option>

        <option>
          GOOGL
        </option>

      </select>

      <br />
      <br />

      <button
        onClick={
          handlePredict
        }
      >
        Get Prediction
      </button>

      <br />
      <br />

      {loading && (
        <p>
          Loading...
        </p>
      )}

      {prediction && (

        <div>

          <h2>
            Prediction
          </h2>

          <p>
            Ticker:
            {" "}
            {prediction.ticker}
          </p>

          <p>
            Action:
            {" "}
            {prediction.action}
          </p>

        </div>

      )}

    </div>
  );
}

export default Prediction;