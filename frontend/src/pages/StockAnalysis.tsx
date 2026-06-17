import {
    useState
  } from "react";
  
  import api
  from "../services/api";
  
  import type{
    StockAnalysis as StockAnalysisType
  } from "../types/stockAnalysis";
  
  function StockAnalysis() {
  
    const [ticker,
      setTicker] =
      useState("AAPL");
  
    const [data,
      setData] =
      useState<
        StockAnalysisType | null
      >(null);
  
    const fetchData =
      async () => {
  
        const response =
          await api.get(
            `/stock-analysis/${ticker}`
          );
  
        setData(
          response.data
        );
      };
  
    return (
  
      <div>
  
        <h1>
          Stock Analysis
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
  
        <button
          onClick={
            fetchData
          }
        >
          Analyze
        </button>
  
        {data && (
  
          <div
            style={{
              marginTop:
                "20px"
            }}
          >
  
            <h2>
              {data.ticker}
            </h2>
  
            <p>
              Close:
              {" "}
              {
                data.close
              }
            </p>
  
            <p>
              RSI:
              {" "}
              {
                data.rsi
              }
            </p>
  
            <p>
              MACD:
              {" "}
              {
                data.macd
              }
            </p>
  
            <p>
              SMA20:
              {" "}
              {
                data.sma20
              }
            </p>
  
            <p>
              SMA50:
              {" "}
              {
                data.sma50
              }
            </p>
  
            <p>
  
              Prediction:
  
              {" "}
  
              <strong>
                {
                  data.prediction
                }
              </strong>
  
            </p>
  
          </div>
  
        )}
  
      </div>
    );
  }
  
  export default StockAnalysis;