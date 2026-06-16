import ModelComparisonChart from "../components/ModelComparisonChart";

function Analytics() {

    const models = [
  
      {
        name: "PPO v1",
        portfolio: 14467,
        sharpe: 0.86,
        drawdown: "-33%"
      },
  
      {
        name: "PPO v7",
        portfolio: 11380,
        sharpe: 0.61,
        drawdown: "-8%"
      },
  
      {
        name: "MultiStock v1",
        portfolio: 10000,
        sharpe: 0.0,
        drawdown: "0%"
      }
  
    ];
  
    return (
  
      <div>
  
        <h1>
          Analytics Dashboard
        </h1>
  
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse"
          }}
        >
  
          <thead>
  
            <tr>
  
              <th>Model</th>
  
              <th>
                Portfolio
              </th>
  
              <th>
                Sharpe
              </th>
  
              <th>
                Drawdown
              </th>
  
            </tr>
  
          </thead>
  
          <tbody>
  
            {models.map(
              (model) => (
  
                <tr
                  key={model.name}
                >
  
                  <td>
                    {model.name}
                  </td>
  
                  <td>
                    {
                      model.portfolio
                    }
                  </td>
  
                  <td>
                    {
                      model.sharpe
                    }
                  </td>
  
                  <td>
                    {
                      model.drawdown
                    }
                  </td>
  
                </tr>
  
              )
            )}
  
          </tbody>
  
        </table>

        <ModelComparisonChart />
  
      </div>
  
    );
  }
  
  export default Analytics;