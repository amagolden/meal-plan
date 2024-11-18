import './App.css';
import OpenAiComponent from "./components/openai";
import Header from './components/header';
import MealForm from './components/form';

function MealPlan() {
  return (
    <div className="Plan">
      <Header />
      <MealForm />
    </div>
  );
}

export default MealPlan;
