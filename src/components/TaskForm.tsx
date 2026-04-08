import { useEffect, useState } from 'react';
import type { Task, TaskPriority } from '../types/task';

interface TaskFormProps {
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  editingTask: Task | null;
  onCancelEdit: () => void;
}

function TaskForm({
  onAddTask,
  onUpdateTask,
  editingTask,
  onCancelEdit,
}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
    } else {
      resetForm();
    }
  }, [editingTask]);

  function resetForm() {
    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('medium');
    setDueDate('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    if (editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'General',
        priority,
        dueDate,
      };

      onUpdateTask(updatedTask);
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'General',
        priority,
        status: 'pending',
        dueDate,
        createdAt: new Date().toISOString(),
      };

      onAddTask(newTask);
    }

    resetForm();
  }

  function handleCancel() {
    resetForm();
    onCancelEdit();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="section-heading">
        {editingTask ? 'Editar tarea' : 'Crear nueva tarea'}
      </h2>
      <p className="section-subtext">
        {editingTask
          ? 'Actualiza la información de la tarea seleccionada.'
          : 'Agrega actividades con prioridad, categoría y fecha límite.'}
      </p>

      <input
        type="text"
        placeholder="Título de la tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      <input
        type="text"
        placeholder="Categoría"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
      >
        <option value="low">Baja</option>
        <option value="medium">Media</option>
        <option value="high">Alta</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <div className="form-actions">
        <button type="submit">
          {editingTask ? 'Guardar cambios' : 'Agregar tarea'}
        </button>

        {editingTask && (
          <button
            type="button"
            className="secondary-btn"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;