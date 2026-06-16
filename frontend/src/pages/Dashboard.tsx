import {
  useEffect,
  useState
} from "react";

import api from "../services/api";

import type {
  DashboardData
} from "../types/dashboard";

function Dashboard() {

  const [data, setData] =
    useState<
      DashboardData | null
    >(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchDashboard =
      async () => {

        try {

          const response =
            await api.get(
              "/dashboard"
            );

          setData(
            response.data
          );

        } catch (error) {

          console.error(
            error
          );

        } finally {

          setLoading(
            false
          );
        }
      };

    fetchDashboard();

  }, []);

  if (loading) {

    return (
      <h2>
        Loading...
      </h2>
    );
  }

  const cards = [

    {
      title:
        "Model",
      value:
        data?.model
    },

    {
      title:
        "Action Space",
      value:
        data?.action_space
    },

    {
      title:
        "Lookback Window",
      value:
        data?.lookback_window
    },

    {
      title:
        "Loaded",
      value:
        String(
          data?.loaded
        )
    }

  ];

  return (

    <div>

      <h1>
        RL Trading Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap: "20px"
        }}
      >

        {cards.map(
          (
            card,
            index
          ) => (

            <div
              key={index}
              style={{
                border:
                  "1px solid #ddd",
                padding:
                  "20px",
                borderRadius:
                  "8px"
              }}
            >

              <h3>
                {card.title}
              </h3>

              <p>
                {card.value}
              </p>

            </div>

          )
        )}

      </div>

    </div>
  );
}

export default Dashboard;