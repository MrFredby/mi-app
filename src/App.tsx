import { useEffect, useMemo, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import type { Task, TaskStatus } from './types/task';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const response = await fetch('http://localhost:3000/api/tareas');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  }

async function handleAddTask(task: Task) {
  try {
    console.log('Enviando tarea:', task);

    const response = await fetch('http://localhost:3000/api/tareas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    const data = await response.json();
    console.log('Respuesta backend:', data);

    if (!response.ok) {
      throw new Error('Error al crear tarea');
    }

    await fetchTasks();
  } catch (error) {
    console.error('Error en handleAddTask:', error);
  }
}

  async function handleDeleteTask(id: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/tareas/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar tarea');
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

      if (editingTask?.id === id) {
        setEditingTask(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateStatus(id: string, status: TaskStatus) {
    try {
      const response = await fetch(`http://localhost:3000/api/tareas/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status } : task
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditTask(task: Task) {
    setEditingTask(task);
  }

  async function handleUpdateTask(updatedTask: Task) {
    try {
      const response = await fetch(`http://localhost:3000/api/tareas/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar tarea');
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );

      setEditingTask(null);
    } catch (error) {
      console.error(error);
    }
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || task.status === selectedStatus;

      const matchesPriority =
        selectedPriority === 'all' || task.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, selectedStatus, selectedPriority]);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress').length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;

  return (
    <main className="app-container">
      <div className="app-wrapper">
        <header className="app-header">
          <span className="app-badge">Productividad inteligente</span>
          <h1>Task Manager Pro</h1>
          <p>
            Organiza tareas, prioridades y fechas en una interfaz moderna,
            clara y enfocada en resultados.
          </p>
        </header>

        <section className="stats-grid">
          <div className="stat-card stat-card-total">
            <span className="stat-label">Total</span>
            <p>{totalTasks}</p>
          </div>

          <div className="stat-card stat-card-pending">
            <span className="stat-label">Pendientes</span>
            <p>{pendingTasks}</p>
          </div>

          <div className="stat-card stat-card-progress">
            <span className="stat-label">En progreso</span>
            <p>{inProgressTasks}</p>
          </div>

          <div className="stat-card stat-card-completed">
            <span className="stat-label">Completadas</span>
            <p>{completedTasks}</p>
          </div>
        </section>

        <FilterBar
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          selectedPriority={selectedPriority}
          onSearchChange={setSearchTerm}
          onStatusChange={setSelectedStatus}
          onPriorityChange={setSelectedPriority}
        />

        <div className="app-grid">
          <TaskForm
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            editingTask={editingTask}
            onCancelEdit={handleCancelEdit}
          />

          <TaskList
            tasks={filteredTasks}
            onDeleteTask={handleDeleteTask}
            onUpdateStatus={handleUpdateStatus}
            onEditTask={handleEditTask}
          />
        </div>
      </div>
    </main>
  );
}

export default App;