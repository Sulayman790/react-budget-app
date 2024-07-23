import { Button, Stack, Nav, Container } from "react-bootstrap"
import { BrowserRouter as Router, Route, Routes, Link, Navigate} from 'react-router-dom'
import AddBudgetModal from "./components/AddBudgetModal"
import AddExpenseModal from "./components/AddExpenseModal"
import ViewExpensesModal from "./components/ViewExpensesModal"
import SetGlobalBudgetModal from "./components/SetGlobalBudgetModal";
import BudgetCard from "./components/BudgetCard"
import UncategorizedBudgetCard from "./components/UncategorizedBudgetCard"
import TotalBudgetCard from "./components/TotalBudgetCard"
import GlobalBudgetCard from "./components/GlobalBudgetCard"
import SavingsPage from "./components/Savings" 
import { useState, useEffect } from "react"
import Login from "./components/Login";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "./contexts/BudgetsContext"
import { auth } from "./firebase";


function BudgetsPage() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [showSetGlobalBudgetModal, setShowSetGlobalBudgetModal] = useState(false)
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState()
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState()
  const { budgets, getBudgetExpenses, deleteBudget, globalBudget  } = useBudgets()

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true)
    setAddExpenseModalBudgetId(budgetId)
  }

    return (
      <>
        <Container className="my-4">
          <Stack direction="horizontal" gap="2" className="mb-4">
            <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>
              Add Budget
            </Button>
            <Button variant="outline-primary" onClick={openAddExpenseModal}>
              Add Expense
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowSetGlobalBudgetModal(true)}
            >
              {globalBudget > 0 ? "Modify Global Budget" : "Set Global Budget"}
            </Button>
          </Stack>
          <div style={{ marginBottom: "1rem" }}>
            <GlobalBudgetCard />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            {budgets.map(budget => {
              const amount = getBudgetExpenses(budget.id).reduce(
                (total, expense) => total + expense.amount,
                0
              )
              return (
                <BudgetCard
                  key={budget.id}
                  name={budget.name}
                  amount={amount}
                  max={budget.max}
                  onAddExpenseClick={() => openAddExpenseModal(budget.id)}
                  onViewExpensesClick={() =>
                    setViewExpensesModalBudgetId(budget.id)
                  }
                  onDeleteBudgetClick = {() => deleteBudget({ id: budget.id })}
                />
              )
            })}
            <UncategorizedBudgetCard
              onAddExpenseClick={openAddExpenseModal}
              onViewExpensesClick={() =>
                setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)
              }
            />
            <TotalBudgetCard />
          </div>
        </Container>
        <AddBudgetModal
          show={showAddBudgetModal}
          handleClose={() => setShowAddBudgetModal(false)}
        />
        <AddExpenseModal
          show={showAddExpenseModal}
          defaultBudgetId={addExpenseModalBudgetId}
          handleClose={() => setShowAddExpenseModal(false)}
        />
        <ViewExpensesModal
          budgetId={viewExpensesModalBudgetId}
          handleClose={() => setViewExpensesModalBudgetId()}
        />
        <SetGlobalBudgetModal 
          show={showSetGlobalBudgetModal}
          handleClose={() => setShowSetGlobalBudgetModal(false)}
        />
      </>
    )
  }


  function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    const handleLogin = (user) => {
      setUser(user);
    };
  
    const handleLogout = () => {
      auth.signOut().then(() => {
        setUser(null);
      });
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!user) {
      return <Login onLogin={handleLogin} />;
    }
  
    return (
      <Router>
        <Container className="my-4">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link as={Link} to="/" className="h1">Budgets</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/savings" className="h1">Savings</Nav.Link>
            </Nav.Item>
            <Nav.Item className="ms-auto">
              <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
            </Nav.Item>
          </Nav>
  
          <Routes>
            <Route path="/" element={<BudgetsPage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Router>
    );
  }
  
  export default App;
