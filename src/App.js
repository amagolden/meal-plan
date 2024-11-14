import './App.css';
import OpenAiComponent from "./components/openai";

function App() {
  return (
    <div className="App">
      <h1>Welcome to our Meal Planner</h1>
      <p>We create weekly meal plans based on your dietary preferences with the goal of reducing food waste.</p>
      <OpenAiComponent />
    </div>
  );
}

export default App;
