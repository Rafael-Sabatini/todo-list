import NewTask from "./NewTask.jsx";
import ShowTasks from "./ShowTasks.jsx";
import {useState} from "react";

function LandingPage() {

    const componentsList = [
        {id: 1, name: "NewTask"},
        {id: 2, name: "ShowTasks"},
    ]

    const [renderComponent, setRenderComponent] = useState();

    const newTask = () => setRenderComponent("NewTask")
    const showTasks = () => setRenderComponent("ShowTasks")
    return (
        <div
            className="
                flex flex-col
                justify-center items-center
                w-screen
                h-screen
                p-4
            ">

            <h1
                className="
                    text-2xl
                    font-bold
                ">Início
            </h1>

            <hr className="border-2 w-full"/>

            <main className="flex-col flex p-4 w-screen">
                Esse projeto foi um desafio pelo João Targino. Ele tem o objetivo de ser uma lista
                de tarefas a fazer, com integração completa com banco de dados e API para armazenar informações.
                <br/><br/>
                Dito isso, selecione uma opção:
                <br/><br/>
                <ul>
                    <button className="w-full bg-white text-black p-1 rounded-md" onClick={newTask}>Criar nova tarefa</button>
                    <br/>
                    <button className="mt-2 w-full bg-white text-black p-1 rounded-md" onClick={showTasks}>Consultar tarefas</button>
                </ul>
            </main>

            <div>
                {renderComponent === "NewTask" && <NewTask />}
                {renderComponent === "ShowTasks" && <ShowTasks />}
            </div>
        </div>
    );
}

export default LandingPage;