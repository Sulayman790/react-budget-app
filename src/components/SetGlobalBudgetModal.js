import React, { useRef } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { useBudgets } from "../contexts/BudgetsContext";

export default function SetGlobalBudgetModal({ show, handleClose }) {
  const globalBudgetRef = useRef();
  const { setGlobalMonthlyBudget } = useBudgets();

  function handleSubmit(e) {
    e.preventDefault();
    setGlobalMonthlyBudget(parseFloat(globalBudgetRef.current.value));
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Set Global Monthly Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="globalBudget">
            <Form.Label>Global Monthly Budget Amount</Form.Label>
            <Form.Control
              ref={globalBudgetRef}
              type="number"
              required
              min={0}
              step={0.01}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Set Global Budget
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}