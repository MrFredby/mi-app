import { useEffect, useMemo, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import type { Task, TaskStatus } from './types/task';
import { getTasksFromStorage, saveTasksToStorage } from './utils/storage';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  useEffect(() => {
    const savedTasks = getTasksFromStorage();
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  function handleAddTask(task: Task) {
    setTasks((prevTasks) => [task, ...prevTasks]);
  }

  function handleDeleteTask(id: string) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    if (editingTask?.id === id) {
      setEditingTask(null);
    }
  }

  function handleUpdateStatus(id: string, status: TaskStatus) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  }

  function handleEditTask(task: Task) {
    setEditingTask(task);
  }

  function handleUpdateTask(updatedTask: Task) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    setEditingTask(null);
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