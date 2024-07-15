import React from "react"
import { Button, Card, ProgressBar, Stack } from "react-bootstrap"
import { currencyFormatter } from "../utils"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUtensils, 
  faHome, 
  faGamepad, 
  faFootballBall, 
  faGasPump, 
  faGift, 
  faShoppingBasket,
  faTrash,
  faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons'

// Define an object to map category names to icons
const categoryIcons = {
  'Restaurant': faUtensils,
  'Rent': faHome,
  'Hobbies': faGamepad,
  'Sport': faFootballBall,
  'Gas': faGasPump,
  'Gift': faGift,
  'Food': faShoppingBasket,
  'Uncategorized': faQuestionCircle
}

export default function BudgetCard({
  id,
  name,
  amount,
  max,
  gray,
  hideButtons,
  onAddExpenseClick,
  onDeleteBudgetClick,
  onViewExpensesClick,
}) {
  const classNames = []
  if (amount > max) {
    classNames.push("bg-danger", "bg-opacity-10")
  } else if (gray) {
    classNames.push("bg-light")
  }

  const icon = categoryIcons[name]

  return (
    <Card className={classNames.join(" ")}>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
          <div className="me-2 d-flex align-items-center">
            {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
            {name}
          </div>
          <div className="d-flex align-items-baseline">
            {currencyFormatter.format(amount)}
            {max && (
              <span className="text-muted fs-6 ms-1">
                / {currencyFormatter.format(max)}
              </span>
            )}
          </div>
        </Card.Title>
        {max && (
          <ProgressBar
            className="rounded-pill"
            variant={getProgressBarVariant(amount, max)}
            min={0}
            max={max}
            now={amount}
          />
        )}
        {!hideButtons && (
          <Stack direction="horizontal" gap="2" className="mt-4">
            <Button
              variant="outline-primary"
              className="ms-auto"
              onClick={onAddExpenseClick}
            >
              Add Expense
            </Button>
            <Button onClick={onViewExpensesClick} variant="outline-secondary">
              View Expenses
            </Button>
            <Button onClick={() => onDeleteBudgetClick(id)} variant="outline-danger">
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Stack>
        )}
      </Card.Body>
    </Card>
  )
}

function getProgressBarVariant(amount, max) {
  const ratio = amount / max
  if (ratio < 0.5) return "primary"
  if (ratio < 0.75) return "warning"
  return "danger"
}