import React, { useContext, useEffect} from "react"
import { v4 as uuidV4 } from "uuid"
import useLocalStorage from "../hooks/useLocalStorage"

const BudgetsContext = React.createContext()

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized"
export const GLOBAL_BUDGET_ID = "Global"

export function useBudgets() {
  return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage("budgets", [])
  const [expenses, setExpenses] = useLocalStorage("expenses", [])
  const [ globalBudget, setGlobalBudget ] = useLocalStorage("globalBudget", { 
    amount: 0,
    lastResetDate: new Date().toISOString() 
  })

  useEffect(() => {
    const today = new Date()
    const lastResetDate = new Date(globalBudget.lastResetDate)
    if (today.getMonth() !== lastResetDate.getMonth() || today.getFullYear() !== lastResetDate.getFullYear()) {
      resetBudgets()
    }
  }, [globalBudget.lastResetDate])


  function getBudgetExpenses(budgetId) {
    return expenses.filter(expense => expense.budgetId === budgetId)
  }
  function addExpense({ description, amount, budgetId }) {
    setExpenses(prevExpenses => {
      return [...prevExpenses, { id: uuidV4(), description, amount, budgetId }]
    })
  }
  function addBudget({ name, max }) {
    setBudgets(prevBudgets => {
      if (prevBudgets.find(budget => budget.name === name)) {
        return prevBudgets
      }
      return [...prevBudgets, { id: uuidV4(), name, max }]
    })
  }
  function deleteBudget({ id }) {
    setExpenses(prevExpenses => {
      return prevExpenses.map(expense => {
        if (expense.budgetId !== id) return expense
        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID }
      })
    })

    setBudgets(prevBudgets => {
      return prevBudgets.filter(budget => budget.id !== id)
    })
  }
  
  function deleteExpense({ id }) {
    setExpenses(prevExpenses => {
      return prevExpenses.filter(expense => expense.id !== id)
    })
  }

  function setGlobalMonthlyBudget(amount) {
    setGlobalBudget({ amount, lastResetDate: new Date().toISOString() })
  }

  function resetBudgets() {
    setExpenses([])
    setBudgets([])
    setGlobalBudget(prev => ({ ...prev, lastResetDate: new Date().toISOString() }))
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        globalBudget: globalBudget.amount,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
        setGlobalMonthlyBudget,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  )
}
