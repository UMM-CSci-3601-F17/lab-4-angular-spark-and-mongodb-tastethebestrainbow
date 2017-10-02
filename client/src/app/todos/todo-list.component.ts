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

    public todoOwner : string;
    public todoCategory : string;
    public todoBody : string;
    public todoStatus : string;

    public newTodoOwner:string;
    public newTodoCategory: string;
    public newTodoBody: string;
    public newTodoStatus: string;


    //Inject the TodoListService into this component.
    //That's what happens in the following constructor.
    //
    //We can call upon the service for interacting
    //with the server.
    constructor(public todoListService: TodoListService) {

    }

    addNewTodo(owner: string, category: string, body : string, status : string) : void{

        //Here we clear all the fields, probably a better way of doing
        //this could be with clearing forms or something else
        this.newTodoOwner = null;
        this.newTodoCategory = null;
        this.newTodoBody = null;
        this.newTodoStatus = null;

        this.todoListService.addNewTodo(owner, category, body, status).subscribe(
            succeeded => {
            this.todoAddSuccess = succeeded;
            // Once we added a new Todo, refresh our todo list.
            // There is a more efficient method where we request for
            // this new todo from the server and add it to todos, but
            // for this lab it's not necessary
            this.refreshTodos();
        });
    }


    public filterTodos(searchOwner: string, searchCategory: string, searchBody: string, searchStatus: string): Todo[] {

        this.filteredTodos = this.todos;

        //Filter by owner
        if (searchOwner != null) {
            searchOwner = searchOwner.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchOwner || todo.owner.toLowerCase().indexOf(searchOwner) !== -1;
            });
        }

        //Filter by category
        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchCategory || todo.category.toLowerCase().indexOf(searchCategory) !== -1;
            });
        }

        //Filter by body
        if (searchBody != null && searchBody != "") {
            searchBody = searchBody.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchBody || todo.body.toLowerCase().indexOf(searchBody) !== -1;
            });
        }

        //Filter by status
        if (searchStatus != null) {
            searchStatus = searchStatus.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchStatus || todo.status.toLowerCase().indexOf(searchStatus) !== -1;
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
                this.filterTodos(this.todoOwner, this.todoCategory, this.todoBody, this.todoStatus);
            },
            err => {
                console.log(err);
            });
    }

    ngOnInit(): void {
        this.refreshTodos();
    }
}
