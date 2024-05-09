const { Task, User } = require('../model/User');



const CreateTask = async (req, res) => {
    const { title, description="", status = "pending", priority = "low", duedate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } = req.body;
    try {
        const user = await User.findOne({ where: { id: req.userId } });
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        const task = await Task.create({
            title,
            description,
            UserId: req.userId,
            status,
            priority,
            duedate,
            userId : user.id
        });
        return res.status(201).json({ status: true,message:"new task created successfully.", task });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ status: false, message: 'Internal server error', error: error });
    }
}

const GetAllTasksForUser = async (req, res) => {
    try {
      const user = await User.findOne({ where: { id: req.userId }, include: Task });
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }
      return res.status(200).json({ status: true, user });
    } catch (error) {
      console.error('Error fetching tasks for user:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', error: error });
    }
}

const GetAllTasks = async (req, res) => {
    try {
      const tasks = await Task.findAll();
      return res.status(200).json({ status: true, tasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', error: error });
    }
}

const UpdateTask = async (req, res) => {
    const taskId = req.params.id;
    const { title, description, status , priority, duedate = null } = req.body;
    try {
      const task = await Task.findOne({ where: { id: taskId, userId: req.userId } });
      console.log(("================================================"));
      console.log(task);
      console.log(("================================================"));

      if (!task) {
        return res.status(404).json({ status: false, message: "Task not found for user" });
      }
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;ority = priority || task.priority;
      task.duedate = duedate || task.duedate;

      await task.save();
      return res.status(200).json({ status: true, message : "task details updated", task });
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', error: error });
    }
  }

const DeleteTask = async (req, res) => {
    const taskId = req.params.id;
    try {
      const task = await Task.findOne({ where: { id: taskId, userId: req.userId } });
      if (!task) {
        return res.status(404).json({ status: false, message: "Task not found for user" });
      }
      await task.destroy();
      return res.status(200).json({ status: true, message: "Task deleted successfully" });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', error: error });
    }
}


const DeleteMultipleTasks = async (req, res) => {
  const taskIds = req.body.taskIds;
  try {
      const result = await Task.destroy({
          where: {
              id: taskIds,
              userId: req.userId
          }
      });
      if (result === 0) {
          return res.status(404).json({ status: false, message: "Tasks not found for user" });
      }
      return res.status(200).json({ status: true, message: "Tasks deleted successfully" });
  } catch (error) {
      console.error('Error deleting tasks:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', error: error });
  }
}

  
  
  





module.exports = {CreateTask , GetAllTasksForUser, UpdateTask, DeleteTask, GetAllTasks, DeleteMultipleTasks}
