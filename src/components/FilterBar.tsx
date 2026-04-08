interface FilterBarProps {
  searchTerm: string;
  selectedStatus: string;
  selectedPriority: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

function FilterBar({
  searchTerm,
  selectedStatus,
  selectedPriority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: FilterBarProps) {
  return (
    <section className="filter-bar">
      <div className="filter-header">
        <h2 className="section-heading">Buscar y filtrar</h2>
        <p className="section-subtext">
          Encuentra tareas por nombre, estado o prioridad.
        </p>
      </div>

      <div className="filter-controls">
        <input
          type="text"
          placeholder="Buscar por título o descripción"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="in-progress">En progreso</option>
          <option value="completed">Completada</option>
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          <option value="all">Todas las prioridades</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>
    </section>
  );
}

export default FilterBar;