import "./styles/App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [hello, setHello] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/mem/1").then((res) => {
      setHello(res.data);
    });
  }, []);
  return <div className="App">백엔드 데이터 : {hello}</div>;
}

export default App;
