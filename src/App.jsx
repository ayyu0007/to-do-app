// App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card, Badge } from 'react-bootstrap';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [username, setUsername] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState(false);
  const [taskType, setTaskType] = useState('Office');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task || !username || isNaN(date)) {
      alert('Please fill in all fields correctly.');
      return;
    }
    const newTask = { task, username, date, status: status ? 1 : 0, taskType };
    try {
      await axios.post('http://localhost:4000/tasks', newTask);
      fetchTasks();
      setTask('');
      setUsername('');
      setDate('');
      setStatus(false);
      setTaskType('Office');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:4000/tasks/${id}`, { status: currentStatus ? 0 : 1 });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  const renderBadgeColor = (taskType) => {
    switch (taskType) {
      case 'Office':
        return 'danger';
      case 'Personal':
        return 'warning';
      case 'Family':
        return 'success';
      case 'Friends':
        return 'primary';
      case 'Other':
        return 'secondary';
      default:
        return 'dark';
    }
  };

  const renderCardColor = (taskType) => {
    switch (taskType) {
      case 'Office':
        return 'bg-danger';
      case 'Personal':
        return 'bg-warning';
      case 'Family':
        return 'bg-success';
      case 'Friends':
        return 'bg-primary';
      case 'Other':
        return 'bg-secondary';
      default:
        return '';
    }
  };

  const handleCheckboxChange = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:4000/tasks/${id}`, { status: currentStatus ? 0 : 1 });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  return (
    <Container>
      <h1 className="mt-4 text-center">Todo List</h1>
      <Form onSubmit={handleSubmit} className="mt-4">
        <Form.Group controlId="task">
          <Form.Label>Task</Form.Label>
          <Form.Control type="text" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Enter Task" />
        </Form.Group>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" />
        </Form.Group>
        <Form.Group controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Enter Date (Numbers Only)" />
        </Form.Group>
        <Form.Group controlId="taskType">
          <Form.Label>Task Type</Form.Label>
          <Form.Control as="select" value={taskType} onChange={(e) => setTaskType(e.target.value)}>
            <option value="Office">Office</option>
            <option value="Personal">Personal</option>
            <option value="Family">Family</option>
            <option value="Friends">Friends</option>
            <option value="Other">Other</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">Add Task</Button>
      </Form>
      <div className="mt-4">
        {tasks.map((task, index) => (
          <Card key={index} className={`mb-3 ${renderCardColor(task.taskType)}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="mb-0">{task.task}</Card.Title>
                <Button variant="danger" onClick={() => handleDelete(task.id)}>Delete</Button>
              </div>
              <Card.Subtitle className="mb-2 text-muted"><span className="text-dark">{task.username}</span></Card.Subtitle>
              <Card.Text className="mb-1"><span className="text-dark">{task.date}</span></Card.Text>
              <Badge bg={task.status ? 'success' : 'danger'}>{task.status ? 'Completed' : 'Pending'}</Badge>
              <Badge bg={renderBadgeColor(task.taskType)} className="ms-2">{task.taskType}</Badge>
              <Form.Check
                type="checkbox"
                id={`checkbox-${index}`}
                label="Mark Completed"
                checked={task.status}
                onChange={() => handleCheckboxChange(task.id, task.status)}
                className="ms-2"
              />
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default App;
