interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface CreateTaskRequest {
  title: string;
}

let tasks: Task[] = [
    { id: "1", title: "Learn Next.js", completed: false },
    { id: "2", title: "Build a Project", completed: true },
    { id: "3", title: "Deploy the App", completed: false }
];

export async function GET(request: Request) {
  return Response.json(tasks);
}

export async function POST(request: Request) {
    try {
        const body : CreateTaskRequest = await request.json();

        if (!body.title) {
            return Response.json({ error: "Title is required" }, { status: 400 });
        }

        const newTask: Task = {
            id: (tasks.length + 1).toString(),
            title: body.title,
            completed: false
        };
        tasks.push(newTask);
        return Response.json(newTask, { status: 201 });
    } catch (error) {
        return Response.json({ error: "Failed to create task" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get("id") || "");

        if (!id) {
            return Response.json({ error: "Task ID is required" }, { status: 400 });
        }

        const taskIndex = tasks.findIndex(task => task.id === id.toString());

        if (taskIndex === -1) {
            return Response.json({ error: "Task not found" }, { status: 404 });
        }

        tasks = tasks.filter(task => task.id !== id.toString());
        return Response.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        return Response.json({ error: "Failed to delete task" }, { status: 500 });
    }
}