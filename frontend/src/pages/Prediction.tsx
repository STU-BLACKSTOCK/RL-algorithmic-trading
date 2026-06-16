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

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  const getActionColor =
    (action: string) => {

      if (
        action.includes("BUY")
      )
        return "#22c55e";

      if (
        action.includes("SELL")
      )
        return "#ef4444";

      return "#64748b";
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

        <option>AAPL</option>
        <option>MSFT</option>
        <option>GOOGL</option>

      </select>

      <button
        onClick={
          handlePredict
        }
        style={{
          marginLeft: "10px"
        }}
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, 1fr)",
            gap: "20px"
          }}
        >

          <div
            style={{
              border:
                "1px solid #ddd",
              borderRadius:
                "8px",
              padding:
                "20px"
            }}
          >

            <h3>
              Selected Stock
            </h3>

            <p>
              {
                prediction.ticker
              }
            </p>

          </div>

          <div
            style={{
              border:
                "1px solid #ddd",
              borderRadius:
                "8px",
              padding:
                "20px"
            }}
          >

            <h3>
              Trading Signal
            </h3>

            <p
              style={{
                color:
                  getActionColor(
                    prediction.action
                  ),
                fontWeight:
                  "bold",
                fontSize:
                  "20px"
              }}
            >

              {
                prediction.action
              }

            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default Prediction;