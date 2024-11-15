import './App.css';
import OpenAiComponent from "./components/openai";
import Header from './components/header';

function MealPlan() {
  return (
    <div className="App">
      <Header />
      <h1>Welcome to our Meal Planner</h1>
      <p>We create weekly meal plans based on your dietary preferences with the goal of reducing food waste.</p>
      <OpenAiComponent />
    </div>
  );
}

export default MealPlan;
