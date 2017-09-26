import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Todo} from "./todo";
import {TodoListComponent} from "./todo-list.component";
import {TodoListService} from "./todo-list.service";
import {Observable} from "rxjs";
import {FormsModule} from "@angular/forms"; //for [(ngModule)] to not break tests

describe("Todo list", () => {

    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.of([
                {
                    _id: "chris_id",
                    name: "Chris",
                    age: 25,
                    company: "UMM",
                    email: "chris@this.that"
                },
                {
                    _id: "pat_id",
                    name: "Pat",
                    age: 37,
                    company: "IBM",
                    email: "pat@something.com"
                },
                {
                    _id: "jamie_id",
                    name: "Jamie",
                    age: 37,
                    company: "Frogs, Inc.",
                    email: "jamie@frogs.com"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [TodoListComponent],
            // providers:    [ TodoListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("contains all the todos", () => {
        expect(todoList.todos.length).toBe(3);
    });

    it("contains a todo named 'Chris'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.name === "Chris")).toBe(true);
    });

    it("contain a todo named 'Jamie'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.name === "Jamie")).toBe(true);
    });

    it("doesn't contain a todo named 'Santa'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.name === "Santa")).toBe(false);
    });

    it("has two todos that are 37 years old", () => {
        expect(todoList.todos.filter((todo: Todo) => todo.age === 37).length).toBe(2);
    });

});

describe("Misbehaving Todo List", () => {
    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.create(observer => {
                observer.error("Error-prone observable");
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [TodoListComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("generates an error if we don't set up a TodoListService", () => {
        // Since the observer throws an error, we don't expect todos to be defined.
        expect(todoList.todos).toBeUndefined();
    });
});
