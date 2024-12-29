import { MongoUnexpectedServerResponseError } from "mongodb";
import Task from "../models/Task.js";
import User from "../models/User.js";
import crypto from "crypto";

async function createTask(req, res) {
    const { title, subtitle, priority, due, repeatition } = req.body; 
    
    const task = {
        taskid: crypto.randomInt(1000000,9999999).toString(),
        title: title,
        subtitle: subtitle,
        priority: priority,
        due: due,
        completed: false, 
        repeatition: repeatition,
    };
    
    const username = req.user.username;
    try {
        const user = await User.findOneAndUpdate(
            { username }, 
            { $push: { tasks:  task.taskid} }, 
            { new: true, runValidators: true }  
        );

        if (!user) {
            return res.status(404).json({
                message: "Cannot find the user!"
            });
        }
        
        const t = Task.create(task);

        if(!t) return res.status(400).json({
            message: "something went wrong"
        });

        res.status(200).json({
            message: "Task created successfully!",
            task: task,  
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error: " + error.message,
        });
    }
}

async function deleteTask(req, res) {
    const taskid = req.body.taskid;
    const username = req.user.username;
    
    try{
        
        const user = await User.findOneAndUpdate(
            { username }, 
            { $pull: { tasks:  taskid} }, 
            { new: true, runValidators: true }  
        );

        if(!user){
            return res.status(404).json({
                message: "Cant find user"
            });
        }
        
        const result = await Task.deleteOne({ taskid: taskid});
        
        if (result.deletedCount === 1){
            return res.status(200).json({
                message: "Deleted successfully",
            });
        }else{
            return res.status(404).json({
                message: "Cant find task"
            });
        }
        
    }
    catch (error){
        return res.status(500).json({
            message: "Maa chud gyi somewhere"
        });
    }
        
}

export { createTask, deleteTask };
