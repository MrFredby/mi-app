import type { Task, TaskStatus } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
}

function TaskList({
  tasks,
  onDeleteTask,
  onUpdateStatus,
  onEditTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty-state">No hay tareas registradas todavía.</p>;
  }

  function getStatusLabel(status: TaskStatus) {
    if (status === 'pending') return 'Pendiente';
    if (status === 'in-progress') return 'En progreso';
    return 'Completada';
  }

  function getPriorityLabel(priority: Task['priority']) {
    if (priority === 'low') return 'Baja';
    if (priority === 'medium') return 'Media';
    return 'Alta';
  }

  return (
    <div className="task-list">
      <h2 className="section-heading">Panel de tareas</h2>
      <p className="section-subtext">
        Visualiza el estado, prioridad y vencimiento de cada actividad.
      </p>

      {tasks.map((task) => (
        <div className={`task-card status-${task.status}`} key={task.id}>
          <div className="task-card-top">
            <h3>{task.title}</h3>

            <div className="task-card-buttons">
              <button
                className="edit-btn"
                onClick={() => onEditTask(task)}
              >
                Editar
              </button>
              <button onClick={() => onDeleteTask(task.id)}>Eliminar</button>
            </div>
          </div>

          <p>{task.description || 'Sin descripción'}</p>

          <div className="task-meta">
            <span>Categoría: {task.category}</span>
            <span className={`priority-badge priority-${task.priority}`}>
              Prioridad: {getPriorityLabel(task.priority)}
            </span>
            <span>Estado: {getStatusLabel(task.status)}</span>
            <span>Fecha límite: {task.dueDate || 'No definida'}</span>
          </div>

          <div className="task-actions-row">
            <button
              className="status-btn"
              onClick={() => onUpdateStatus(task.id, 'pending')}
            >
              Pendiente
            </button>

            <button
              className="status-btn"
              onClick={() => onUpdateStatus(task.id, 'in-progress')}
            >
              En progreso
            </button>

            <button
              className="status-btn"
              onClick={() => onUpdateStatus(task.id, 'completed')}
            >
              Completada
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;