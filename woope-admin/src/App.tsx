import ListGroup from "./components/ListGroup";
import Button from "./components/Button";
import Alert from "./components/Alert";
import { useState } from "react";

function App() {
  const [alertVisible, setAlertVisible] = useState(false);

  return (
    <div>
      {alertVisible && (
        <Alert onClose={() => setAlertVisible(false)}>Hello World!</Alert>
      )}
      <Button color="danger" onClick={() => setAlertVisible(true)}>
        Hello World
      </Button>
    </div>
  );
}

export default App;
