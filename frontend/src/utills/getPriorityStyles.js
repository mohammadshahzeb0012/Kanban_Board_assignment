
const getPriorityStyles = (priority) => {
    const lowerPriority = priority.toLowerCase();
    if (lowerPriority === "high") {
        return { backgroundColor: "#FEE2E2", color: "#DC494A" };
    } else if (lowerPriority === "medium") {
        return { backgroundColor: "#FEF9C3", color: "#CD8A04" };
    } else if (lowerPriority === "low") {
        return { backgroundColor: "#EAFDF1", color: "#77CA95" };
    } else {
        return {};
    }
};

export default getPriorityStyles