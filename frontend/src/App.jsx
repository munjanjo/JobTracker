import { useEffect, useState } from "react";
import { api } from "./api/client";

export default function App() {
  const [result, setResult] = useState("Učitavam...");

  useEffect(() => {
    api
      .get("/applications")
      .then((res) => setResult(`OK: ${res.data.length} prijava`))
      .catch((err) =>
        setResult(`Greška: ${err.response?.status ?? err.message}`),
      );
  }, []);

  return <p>{result}</p>;
}
