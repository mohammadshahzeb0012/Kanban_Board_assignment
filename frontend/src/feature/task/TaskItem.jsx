import { Pen } from 'lucide-react';
import TaskDelete from '../../components/TaskDelete';
import getPriorityStyles from '../../utills/getPriorityStyles';
import "./TaskItem.scss"
import EditTask from '../../components/EditTask';

const TaskItem = ({ task, index, showModal, listIndex, onDragStart }) => {
  return (<div
    key={task._id}
    className="task-item"
    draggable
    onDragStart={() => onDragStart(task, listIndex)}
  >
    <div className="task-item-main">
      <div className="task-item-main-top">
        <span>{task.title}</span>
        <span style={getPriorityStyles(task.priority)}>{task.priority}</span>
      </div>
      <p>{task.description}</p>
      <div className="task-item-date-option">
        <span>Due: {task.dueDate}</span>
        <div className="task-item-date-option-icons">
          <span><EditTask showModal={showModal} task={task} taskIndex={index} listIndex={listIndex} /></span>
          <span><TaskDelete ListIndex={listIndex} taskId={task._id} /></span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default TaskItem;