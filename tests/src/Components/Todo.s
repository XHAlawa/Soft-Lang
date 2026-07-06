@Component
@Title("Todo")

@Template
<div class="todo">
  <h3>Todo List</h3>
  <div class="input-group">
    <input type="text" @bind="newTodo" placeholder="Add todo..." />
    <button @click="addTodo">Add</button>
  </div>
  <ul>
    @foreach="todos" { todo ->
      <li>
        <input type="checkbox" @bind="todo.done" />
        <span @visible:!todo.done>@todo.text</span>
        <span @visible:todo.done style="text-decoration: line-through">@todo.text</span>
        <button @click="removeTodo(todo)">×</button>
      </li>
    }
  </ul>
  <div class="status">
    Total: @todos.length | Done: @doneCount
  </div>
</div>

@Code
@property newTodo = ''
@property todos = []

get doneCount() {
  return this.todos.filter((t: any) => t.done).length;
}

addTodo() {
  if (this.newTodo.trim()) {
    this.todos.push({ text: this.newTodo, done: false });
    this.newTodo = '';
  }
}

removeTodo(todo: any) {
  const index = this.todos.indexOf(todo);
  if (index > -1) {
    this.todos.splice(index, 1);
  }
}

@Style
.todo {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.todo h3 {
  margin: 0 0 10px 0;
}

.input-group {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
}

.input-group input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.todo ul {
  list-style: none;
  padding: 0;
}

.todo li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
}

.todo button {
  padding: 5px 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.status {
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 3px;
}
