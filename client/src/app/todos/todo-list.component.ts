import {Component, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";

@Component({
    selector: 'todo-list-component',
    templateUrl: 'todo-list.component.html',
    styleUrls: ['./todo-list.component.css'],
    providers: []
})

export class TodoListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public todos: Todo[];
    public filteredTodos: Todo[];
    private todoAddSuccess : Boolean = false;

    public todoName : string;
    public todoAge : number;

    public newTodoName:string;
    public newTodoAge: number;
    public newTodoCompany: string;
    public newTodoEmail: string;


    //Inject the TodoListService into this component.
    //That's what happens in the following constructor.
    //
    //We can call upon the service for interacting
    //with the server.
    constructor(public todoListService: TodoListService) {

    }

    addNewTodo(name: string, age: number, company : string, email : string) : void{

        //Here we clear all the fields, probably a better way of doing
        //this could be with clearing forms or something else
        this.newTodoName = null;
        this.newTodoAge = null;
        this.newTodoCompany = null;
        this.newTodoEmail = null;

        this.todoListService.addNewTodo(name, age, company, email).subscribe(
            succeeded => {
            this.todoAddSuccess = succeeded;
            // Once we added a new Todo, refresh our todo list.
            // There is a more efficient method where we request for
            // this new todo from the server and add it to todos, but
            // for this lab it's not necessary
            this.refreshTodos();
        });
    }



    public filterTodos(searchName: string, searchAge: number): Todo[] {

        this.filteredTodos = this.todos;

        //Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchName || todo.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }

        //Filter by age
        if (searchAge != null) {
            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchAge || todo.age == searchAge;
            });
        }

        return this.filteredTodos;
    }

    /**
     * Starts an asynchronous operation to update the todos list
     *
     */
    refreshTodos(): void {
        //Get Todos returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)
        this.todoListService.getTodos().subscribe(
            todos => {
                this.todos = todos;
                this.filterTodos(this.todoName, this.todoAge);
            },
            err => {
                console.log(err);
            });
    }

    ngOnInit(): void {
        this.refreshTodos();
    }
}
