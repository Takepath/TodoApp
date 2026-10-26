export class Todo{
    constructor(title,date = new Date(),allDay = false){        
        this.title = title;
        this.completed = false;
        this.dueDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
        this.dueTime = `${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}`;
        this.allDay = allDay;
        this.createdAt = new Date();
    }
}