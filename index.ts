import { type Controller } from "./Controller";
import { type ModelController } from "./ModelController";
import { Router } from "./Router";
import { Model } from "./Model";

class User extends Model {
    name!: string;
    email!: string;

    constructor() {
        super();
    }

    find(id: number): User | undefined {
        return users.find((user) => user.id === id);
    }
}

let users: User[] = [];

for (let i = 0; i < 10; i++) {
    const user = new User();
    user.id = i + 1;
    user.name = "User " + i;
    user.email = "user" + i + "@example.com";
    users.push(user);
}

class UserController implements ModelController<User> {
    model: User;

    constructor() {
        this.model = new User();
    }

    index(request: Request): Response {
        return new Response(JSON.stringify(users));
    }
    show(request: Request, user: User): Response {
        if (user) {
            return new Response(JSON.stringify(user));
        } else {
            return new Response("Not found", { status: 404 });
        }
    }
    create(request: Request, model: User): Response {
        users.push(model);
        return new Response(JSON.stringify(model), { status: 201 });
    }
    update(request: Request, model: User): Response {
        throw new Error("Method not implemented.");
    }
    delete(request: Request, model: User): Response {
        throw new Error("Method not implemented.");
    }
    patch(request: Request, model: User): Response {
        throw new Error("Method not implemented.");
    }
    options(request: Request, model: User): Response {
        throw new Error("Method not implemented.");
    }
}

const router = new Router();
router.use(async (request: Request, params : Record<string, string>, next: () => Promise<Response>) =>{
    console.log(request.method, request.url);
    return await next();
})

router.group("/api", [async (request: Request, params : Record<string, string>, next: () => Promise<Response>) =>{
    console.log('API is being called!');
    return await next();
}], group => {
    group.mapModelController("/users", new UserController());
})

function home(request: Request, params: Record<string, string>): Response {
    return new Response("Hello World");
}

router.get("/", home, [async (request: Request, params : Record<string, string>, next: () => Promise<Response>) =>{
    console.log('Home is being called!');
    return await next();
}]);

Bun.serve({
    port: 8080,
    async fetch(request) {
        return await router.route(request);
    },
});
