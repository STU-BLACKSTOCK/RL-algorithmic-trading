function Dashboard() {

  const cards = [

    {
      title:
        "Model",
      value:
        "ppo_aapl_v7"
    },

    {
      title:
        "Action Space",
      value:
        "5"
    },

    {
      title:
        "Lookback",
      value:
        "30"
    },

    {
      title:
        "Backend",
      value:
        "Connected"
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