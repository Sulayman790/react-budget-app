import React, { useContext, useEffect, useCallback } from "react";
import { v4 as uuidV4 } from "uuid";
import useFirebase from "../hooks/useFirebase";

const BudgetsContext = React.createContext();

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized";
export const GLOBAL_BUDGET_ID = "Global";

export function useBudgets() {
  return useContext(BudgetsContext);
}

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets, loadingBudgets] = useFirebase("budgets", []);
  const [expenses, setExpenses, loadingExpenses] = useFirebase("expenses", []);
  const [globalBudget, setGlobalBudget, loadingGlobalBudget] = useFirebase("globalBudget", { 
    amount: 0,
    lastResetDate: new Date().toISOString() 
  });
  const [monthlySalary, setMonthlySalary, loadingMonthlySalary] = useFirebase("monthlySalary", {
    amount: 0,
    lastResetDate: new Date().toISOString()
  });

  const loading = loadingBudgets || loadingExpenses || loadingGlobalBudget || loadingMonthlySalary;

  useEffect(() => {
    console.log('Loading states:', {
      budgets: loadingBudgets,
      expenses: loadingExpenses,
      globalBudget: loadingGlobalBudget,
      monthlySalary: loadingMonthlySalary
    });
    console.log('Overall loading:', loading);
  }, [loadingBudgets, loadingExpenses, loadingGlobalBudget, loadingMonthlySalary, loading]);

  const resetBudgets = useCallback(() => {
    setExpenses([]);
    setBudgets([]);
    setGlobalBudget(prev => ({ ...prev, lastResetDate: new Date().toISOString() }));
    setMonthlySalary(prev => ({ ...prev, lastResetDate: new Date().toISOString() }));
  }, [setExpenses, setBudgets, setGlobalBudget, setMonthlySalary]);

  useEffect(() => {
    if (loading) return;

    const today = new Date();
    const lastResetDate = new Date(globalBudget.lastResetDate);
    if (today.getMonth() !== lastResetDate.getMonth() || today.getFullYear() !== lastResetDate.getFullYear()) {
      resetBudgets();
    }
  }, [globalBudget.lastResetDate, loading, resetBudgets]);

  function getBudgetExpenses(budgetId) {
    return expenses.filter(expense => expense.budgetId === budgetId);
  }

  function addExpense({ description, amount, budgetId }) {
    setExpenses(prevExpenses => {
      return [...prevExpenses, { id: uuidV4(), description, amount, budgetId }];
    });
  }

  function addBudget({ name, max }) {
    setBudgets(prevBudgets => {
      if (prevBudgets.find(budget => budget.name === name)) {
        return prevBudgets;
      }
      return [...prevBudgets, { id: uuidV4(), name, max }];
    });
  }

  function deleteBudget({ id }) {
    setExpenses(prevExpenses => {
      return prevExpenses.map(expense => {
        if (expense.budgetId !== id) return expense;
        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID };
      });
    });

    setBudgets(prevBudgets => {
      return prevBudgets.filter(budget => budget.id !== id);
    });
  }

  function deleteExpense({ id }) {
    setExpenses(prevExpenses => {
      return prevExpenses.filter(expense => expense.id !== id);
    });
  }

  function setGlobalMonthlyBudget(amount) {
    setGlobalBudget({ amount, lastResetDate: new Date().toISOString() });
  }

  function setMonthlySalaryAmount(amount) {
    setMonthlySalary({ amount, lastResetDate: new Date().toISOString() });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        globalBudget: globalBudget.amount,
        monthlySalary: monthlySalary.amount,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
        setGlobalMonthlyBudget,
        setMonthlySalaryAmount,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};