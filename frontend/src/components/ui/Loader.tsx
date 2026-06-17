interface LoaderProps {
  text?: string;
  inline?: boolean;
}

function Loader({ text = "Loading...", inline = false }: LoaderProps) {
  return (
    <div className={`loader ${inline ? "loader--inline" : ""}`}>
      <div className="loader__spinner" />
      {text && <span className="loader__text">{text}</span>}
    </div>
  );
}

export default Loader;
