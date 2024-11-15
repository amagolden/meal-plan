import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Features from '../Features';
import MealPlan from '../MealPlan';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Features />} />
        <Route path="/product" element={<MealPlan />} />
    </Routes>
  );
};

export default AppRoutes;
