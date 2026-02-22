import React from 'react';
import type { TodoItem } from '../types/dashboard.types';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// Static todo data
const staticTodos: TodoItem[] = [
  { id: 1, text: 'Review January expenses', completed: false },
  { id: 2, text: 'Set March budget goals', completed: false },
  { id: 3, text: 'Update savings targets', completed: false },
  { id: 4, text: 'Check recurring subscriptions', completed: true },
];

const TodoCard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Card header */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        What to Do
      </h2>

      {/* Todo list */}
      <ul className="space-y-3">
        {staticTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            {/* Checkbox icon - not functional yet, just visual */}
            <div className="flex-shrink-0 mt-0.5">
              {todo.completed ? (
                <CheckCircleOutlineIcon
                  sx={{ color: '#10b981', fontSize: 20 }}
                />
              ) : (
                <RadioButtonUncheckedIcon
                  sx={{ color: '#d1d5db', fontSize: 20 }}
                />
              )}
            </div>

            {/* Todo text */}
            <span
              className={`text-sm ${todo.completed
                ? 'text-gray-400 line-through'
                : 'text-gray-700'
                }`}
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Empty state (in case todos array is empty) */}
      {staticTodos.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">
          No action items at the moment
        </p>
      )}

      {/* Info message */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 italic">
          Note: Checkboxes are not functional yet. This is static demo data.
        </p>
      </div>
    </div>
  );
};

export default TodoCard;
