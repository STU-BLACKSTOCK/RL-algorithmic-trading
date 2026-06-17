import {
    useEffect,
    useState
  } from "react";
  
  import api from "../services/api";
  
  function History() {
  
    const [history,
      setHistory] =
      useState<any[]>([]);
  
    useEffect(() => {
  
      const fetchHistory =
        async () => {
  
          const response =
            await api.get(
              "/history"
            );
  
          setHistory(
            response.data
          );
        };
  
      fetchHistory();
  
    }, []);
  
    return (
  
      <div>
  
        <h1>
          Prediction History
        </h1>
  
        <table
          style={{
            width: "100%"
          }}
        >
  
          <thead>
  
            <tr>
  
              <th>ID</th>
  
              <th>Ticker</th>
  
              <th>Action</th>
  
              <th>Timestamp</th>
  
            </tr>
  
          </thead>
  
          <tbody>
  
            {history.map(
              (item) => (
  
                <tr
                  key={item.id}
                >
  
                  <td>
                    {item.id}
                  </td>
  
                  <td>
                    {item.ticker}
                  </td>
  
                  <td>
                    {item.action}
                  </td>
  
                  <td>
                    {
                      item.created_at
                    }
                  </td>
  
                </tr>
  
              )
            )}
  
          </tbody>
  
        </table>
  
      </div>
  
    );
  }
  
  export default History;