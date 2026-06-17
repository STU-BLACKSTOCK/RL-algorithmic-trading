import { Link } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

function MainLayout({
  children
}: Props) {

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh"
      }}
    >

      <aside
        style={{
          width: "250px",
          padding: "20px",
          borderRight:
            "1px solid #ddd"
        }}
      >

        <h2>
          RL Trading
        </h2>

        <nav>

          <ul
            style={{
              listStyle: "none",
              padding: 0
            }}
          >

            <li>
              <Link to="/">
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/prediction"
              >
                Prediction
              </Link>
            </li>

            <li>
              <Link
                to="/model"
              >
                Model Info
              </Link>
            </li>

            <li>
              <Link
                to="/analytics"
              >
                Analytics
              </Link>
            </li>

            <li>
              <Link
                to="/analysis"
              >
                Stock Analysis
              </Link>
            </li>

            <li>
              <Link
                to="/history"
              >
                History
              </Link>
            </li>

          </ul>

        </nav>

      </aside>

      <main
        style={{
          flex: 1,
          padding: "30px"
        }}
      >

        {children}

      </main>

    </div>
  );
}

export default MainLayout;