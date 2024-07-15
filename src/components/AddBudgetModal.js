import React, { useRef, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { useBudgets } from "../contexts/BudgetsContext";
import CreatableSelect from 'react-select/creatable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUtensils, 
  faHome, 
  faGamepad, 
  faFootballBall, 
  faGasPump, 
  faGift, 
  faShoppingBasket,
  faTshirt
} from '@fortawesome/free-solid-svg-icons';

const predefinedCategories = [
  { value: 'Restaurant', label: 'Restaurant', icon: faUtensils },
  { value: 'Rent', label: 'Rent', icon: faHome },
  { value: 'Hobbies', label: 'Hobbies', icon: faGamepad },
  { value: 'Sport', label: 'Sport', icon: faFootballBall },
  { value: 'Gas', label: 'Gas', icon: faGasPump },
  { value: 'Gift', label: 'Gift', icon: faGift },
  { value: 'Food', label: 'Food', icon: faShoppingBasket },
  { value: 'Clothes', label: 'Clothes', icon: faTshirt }
];

export default function AddBudgetModal({ show, handleClose }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const maxRef = useRef();
  const { addBudget } = useBudgets();

  function handleSubmit(e) {
    e.preventDefault();
    addBudget({
      name: selectedCategory ? selectedCategory.value : '',
      max: parseFloat(maxRef.current.value),
    });
    handleClose();
  }

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
  };

  const formatOptionLabel = ({ value, label, icon }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {icon && <FontAwesomeIcon icon={icon} style={{ marginRight: '10px' }} />}
      <span>{label}</span>
    </div>
  );

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setSelectedCategory(newOption);
  };


  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>New Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <CreatableSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              onCreateOption={handleCreate}
              options={predefinedCategories}
              styles={customStyles}
              formatOptionLabel={formatOptionLabel}
              isClearable
              placeholder="Select or type a category"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="max">
            <Form.Label>Maximum Spending</Form.Label>
            <Form.Control
              ref={maxRef}
              type="number"
              required
              min={0}
              step={0.01}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}