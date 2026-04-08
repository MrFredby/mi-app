import type { Task } from '../types/task';

const TASKS_KEY = 'task-manager-pro-tasks';

export function getTasksFromStorage(): Task[] {
  const storedTasks = localStorage.getItem(TASKS_KEY);
  return storedTasks ? JSON.parse(storedTasks) : [];
}

export function saveTasksToStorage(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}