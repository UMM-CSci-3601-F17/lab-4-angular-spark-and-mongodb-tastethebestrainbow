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
                    owner: "Chris",
                    category: "fish",
                    body: "Salmon",
                    status: true
                },
                {
                    _id: "bob_id",
                    owner: "Bob",
                    category: "fish",
                    body: "Carp",
                    status: true
                },
                {
                    _id: "jon_id",
                    owner: "Jon",
                    category: "Food",
                    body: "Salmon",
                    status: false
                },
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

    it("contains a todo with owner 'Chris'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Chris")).toBe(true);
    });

    it("contain a todo with owner 'Bob'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Bob")).toBe(true);
    });

    it("doesn't contain a todo with owner 'Santa'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Santa")).toBe(false);
    });

    it("has two todos in category 'Fish'", () => {
        expect(todoList.todos.filter((todo: Todo) => todo.category === "Fish").length).toBe(2);
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
