function NewTask() {
    return (
        <div className="flex flex-col w-screen">
            <form className=" p-5 flex flex-col w-full h-fit">
                <label htmlFor="taskName" className="mt-5">Nome da Tarefa</label>
                <textarea className="bg-slate-950 text-white resize-none p-1 rounded-md" id="taskName"></textarea>

                <label htmlFor="taskDescription" className="mt-5">Descrição da Tarefa</label>
                <textarea className="bg-slate-950 text-white resize-none p-1 rounded-md" id="taskDescription"></textarea>

                <button className="w-full  text-black mt-10 p-1 rounded-md">Salvar</button>
            </form>
        </div>
    );
}
export default NewTask;