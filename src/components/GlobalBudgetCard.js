import React from "react"
import { Card, ProgressBar } from "react-bootstrap"
import { currencyFormatter } from "../utils"
import { useBudgets } from "../contexts/BudgetsContext"

export default function GlobalBudgetCard() {
  const { expenses, globalBudget } = useBudgets()
  
  const amount = expenses.reduce((total, expense) => total + expense.amount, 0)

  const getProgressBarVariant = (amount, max) => {
    const ratio = amount / max
    if (ratio < 0.5) return "primary"
    if (ratio < 0.75) return "warning"
    return "danger"
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
          <div className="me-2">Global Monthly Budget</div>
          <div className="d-flex align-items-baseline">
            {currencyFormatter.format(amount)}
            <span className="text-muted fs-6 ms-1">
              / {currencyFormatter.format(globalBudget)}
            </span>
          </div>
        </Card.Title>
        <ProgressBar
          className="rounded-pill"
          variant={getProgressBarVariant(amount, globalBudget)}
          min={0}
          max={globalBudget}
          now={amount}
        />
      </Card.Body>
    </Card>
  )
}