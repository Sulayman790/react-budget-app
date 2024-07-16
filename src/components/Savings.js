import React from 'react'
import { Container, Card, Button, Form } from 'react-bootstrap'
import { useBudgets } from '../contexts/BudgetsContext'
import { currencyFormatter } from '../utils'

export default function SavingsPage() {
  const { expenses, monthlySalary, setMonthlySalaryAmount } = useBudgets()
  const [newSalary, setNewSalary] = React.useState('')

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0)
  const savings = monthlySalary - totalExpenses

  const handleSalarySubmit = (e) => {
    e.preventDefault()
    setMonthlySalaryAmount(parseFloat(newSalary))
    setNewSalary('')
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">Savings Overview</h1>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Monthly Salary</Card.Title>
          <Card.Text>{currencyFormatter.format(monthlySalary)}</Card.Text>
        </Card.Body>
      </Card>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Total Expenses</Card.Title>
          <Card.Text>{currencyFormatter.format(totalExpenses)}</Card.Text>
        </Card.Body>
      </Card>
      <Card className="mb-3" bg={savings >= 0 ? "success" : "danger"} text="white">
        <Card.Body>
          <Card.Title>Savings</Card.Title>
          <Card.Text>{currencyFormatter.format(savings)}</Card.Text>
        </Card.Body>
      </Card>
      <Form onSubmit={handleSalarySubmit}>
        <Form.Group className="mb-3" controlId="monthlySalary">
          <Form.Label>Set Monthly Salary</Form.Label>
          <Form.Control
            type="number"
            value={newSalary}
            onChange={(e) => setNewSalary(e.target.value)}
            placeholder="Enter your monthly salary"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update Monthly Salary
        </Button>
      </Form>
    </Container>
  )
}