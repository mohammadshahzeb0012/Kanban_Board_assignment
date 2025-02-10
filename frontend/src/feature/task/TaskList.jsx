import { EllipsisVertical } from "lucide-react";
import TaskItem from "./TaskItem";
import ActionTooltip from "../../utills/ActionTooltip";
import "./TaskList.scss"

const TaskList = ({ list, index, onDragStart, handleDrop, isTooltipVisible, setIsTooltipVisible, showModal }) => (
  <div className="task-item-wrraper" onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(index)}>
    <div className="task-item-wrraper-head">
      <span>{list.title}</span>
      <span onClick={(e) => {
        e.stopPropagation();
        setIsTooltipVisible(isTooltipVisible === index ? null : index);
      }}>
        <ActionTooltip 
          listIndex={index}
          listId={list._id}
          isVisible={isTooltipVisible === index}>
          <EllipsisVertical />
        </ActionTooltip>
      </span>
    </div>
    {list.tasks?.map((task, taskIndex) => (
      <TaskItem
        key={task._id}
        task={task}
        index={taskIndex}
        listIndex={index}
        onDragStart={onDragStart}
        showModal={showModal}
      />
    ))}
    <div className="task-item-wrapper-bottom">
      <span onClick={(e) => {
        showModal(list._id,index);
      }}>+ Add task</span>
    </div>
  </div>
);
export default TaskList