import React, { useState, useEffect } from "react"
import { Card, ProgressBar, Alert  } from "react-bootstrap"
import { currencyFormatter } from "../utils"
import { useBudgets } from "../contexts/BudgetsContext"
import styles from "../styles.css"

export default function GlobalBudgetCard() {
  const { expenses, globalBudget } = useBudgets()
  const [showAlert, setShowAlert] = useState(false)
  
  const amount = expenses.reduce((total, expense) => total + expense.amount, 0)
  const ratio = amount / globalBudget

  useEffect(() => {
    if (ratio >= 0.8 && ratio < 1) {
      setShowAlert(true)
    } else {
      setShowAlert(false)
    }
  }, [ratio])

  
  const getProgressBarVariant = (amount, max) => {
    const ratio = amount / max
    if (ratio < 0.5) return "primary"
    if (ratio < 0.75) return "warning"
    return "danger"
  }

  return (
    <>
      {showAlert && (
        <Alert className={styles.alertWarning} variant="warning" onClose={() => setShowAlert(false)} dismissible>
          Time to tighten the belt !
        </Alert>
      )}
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
    </>
  )
}