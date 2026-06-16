import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
  } from "recharts";
  
  function ModelComparisonChart() {
  
    const data = [
  
      {
        name: "PPO v1",
        portfolio: 14467
      },
  
      {
        name: "PPO v7",
        portfolio: 11380
      },
  
      {
        name:
          "MultiStock",
        portfolio: 10000
      }
  
    ];
  
    return (
  
      <BarChart
        width={700}
        height={350}
        data={data}
      >
  
        <CartesianGrid
          strokeDasharray="3 3"
        />
  
        <XAxis
          dataKey="name"
        />
  
        <YAxis />
  
        <Tooltip />
  
        <Bar
          dataKey="portfolio"
        />
  
      </BarChart>
  
    );
  }
  
  export default ModelComparisonChart;