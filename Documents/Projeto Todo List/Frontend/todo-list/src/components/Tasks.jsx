import { Button, Textarea } from "@material-tailwind/react";
import {
    getItems,
    createItem,
    updateItem,
    deleteItem,
    completeItem,
} from "./api";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FcCancel, FcCheckmark, FcPlus } from "react-icons/fc";

// NEW: Import Dialog components
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

function Tasks() {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        tarefa_nome: "",
        tarefa_desc: "",
        tarefa_completo: false,
    });

    // The item to edit
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        loadItems();
    }, []);

    /** ========================
     *         READ
     *  ======================== */
    const loadItems = async () => {
        try {
            const data = await getItems();
            setItems(data);
        } catch (error) {
            toast.error("Erro ao carregar tarefas", error);
        }
    };

    /** ========================
     *        CREATE
     *  ======================== */
    const handleCreateItem = async (e) => {
        e.preventDefault();

        if (!newItem.tarefa_nome.trim() || !newItem.tarefa_desc.trim()) {
            toast.error("Favor digitar algo na sua tarefa");
            return;
        }

        try {
            await createItem(newItem);
            setNewItem({ tarefa_nome: "", tarefa_desc: "", tarefa_completo: false });
            loadItems();
            toast.success("Tarefa criada com sucesso!");
        } catch (error) {
            toast.error("Erro ao criar tarefa", error);
        }
    };

    /** ========================
     *        UPDATE
     *  ======================== */
        // Show the modal by setting editItem
    const handleEditClick = (item) => {
            setEditItem({ ...item });
        };

    // Called when user clicks "Save" inside the modal
    const handleUpdateItem = async (e) => {
        e.preventDefault();
        if (!editItem) return;

        try {
            await updateItem(editItem.id, editItem);
            setEditItem(null); // close the dialog
            loadItems();
            toast.success("Alterações salvas!");
        } catch (error) {
            toast.error("Erro ao salvar alterações", error);
        }
    };

    /** ========================
     *        DELETE
     *  ======================== */
    const handleDeleteItem = async (id) => {
        try {
            await deleteItem(id);
            loadItems();
            toast.success("Tarefa excluída com sucesso!");
        } catch (error) {
            toast.error("Erro ao excluir tarefa", error);
        }
    };

    /** ========================
     *       COMPLETE
     *  ======================== */
    const handleCompleteItem = async (id) => {
        try {
            await completeItem(id);
            loadItems();
            toast.success("Tarefa concluída com sucesso!");
        } catch (error) {
            toast.error("Erro ao concluir tarefa", error);
        }
    };

    /** ========================
     *  DATE/TIME FORMATTING
     *  ======================== */
    const formatDateTime = (datetimeString) => {
        if (!datetimeString) return "";
        const dateObj = new Date(datetimeString);
        return dateObj.toLocaleString();
    };

    /** ========================
     *  RENDER
     *  ======================== */
    return (
        <div className="flex flex-col items-center h-full">
            {/* ======================
          CREATE TASK FORM
         ====================== */}
            <form className="p-5 flex flex-col w-fit gap-3" onSubmit={handleCreateItem}>
                <h2 className="text-2xl font-semibold mb-2 text-center">
                    Criar nova tarefa
                </h2>

                <Textarea
                    className="p-1 rounded-md w-96"
                    label="Nome da Tarefa"
                    value={newItem.tarefa_nome}
                    onChange={(e) =>
                        setNewItem({ ...newItem, tarefa_nome: e.target.value })
                    }
                />
                <Textarea
                    label="Descrição da Tarefa"
                    className="p-1 rounded-md"
                    value={newItem.tarefa_desc}
                    onChange={(e) =>
                        setNewItem({ ...newItem, tarefa_desc: e.target.value })
                    }
                />

                <Button fullWidth variant="outlined" color="green" type="submit" className="mt-5">
                    Salvar
                </Button>
            </form>

            {/* ======================
          EDIT TASK MODAL
         ====================== */}
            <Dialog
                open={Boolean(editItem)}
                handler={() => setEditItem(null)} // close the modal if user clicks outside or hits ESC
                // Optional: You can also add `size="md"` or `size="lg"` for the dialog
            >
                {/* HEADER */}
                <DialogHeader>Editar tarefa</DialogHeader>

                {/* BODY */}
                <DialogBody divider className="flex flex-col gap-4">
                    {editItem && (
                        <>
                            <Textarea
                                className="p-1 rounded-md w-full"
                                label="Nome da Tarefa"
                                value={editItem.tarefa_nome}
                                onChange={(e) =>
                                    setEditItem({ ...editItem, tarefa_nome: e.target.value })
                                }
                            />
                            <Textarea
                                className="p-1 rounded-md w-full"
                                label="Descrição da Tarefa"
                                value={editItem.tarefa_desc}
                                onChange={(e) =>
                                    setEditItem({ ...editItem, tarefa_desc: e.target.value })
                                }
                            />
                        </>
                    )}
                </DialogBody>

                <DialogFooter className="space-x-2">
                    <button
                        onClick={() => setEditItem(null)} // close
                        className="p-1 m-0 text-2xl w-fit rounded-md transition-all hover:scale-110 duration-300 bg-transparent"
                    >
                        <FcCancel />
                    </button>
                    <button
                        className="p-1 m-0 text-2xl w-fit rounded-md transition-all hover:scale-110 duration-300 bg-transparent"
                        onClick={handleUpdateItem}>
                        <FcCheckmark />
                    </button>
                </DialogFooter>
            </Dialog>

            <ul className="p-5">
                <h2 className="text-2xl font-semibold mb-2 text-center">
                    Lista de Tarefas
                </h2>

                {items.map((item) => {
                    const textClass = item.tarefa_completo ? "line-through text-gray-400" : "";

                    return (
                        <li
                            key={item.id}
                            className="flex flex-col gap-5 bg-blue-gray-50 p-2 rounded-md my-2 max-w-54"
                        >
                            <strong className={textClass}>{item.tarefa_nome}</strong>
                            <hr className="border-1 border-gray-800" />
                            <span className={textClass}>{item.tarefa_desc}</span>

                            {item.data_criacao && (
                                <small className="text-gray-500">
                                    Criado em: {formatDateTime(item.data_criacao)}
                                </small>
                            )}
                            {item.data_conclusao && (
                                <small className="text-gray-500">
                                    Concluído em: {formatDateTime(item.data_conclusao)}
                                </small>
                            )}

                            <div className="flex flex-row gap-1">
                                {/* Edit button -> opens the dialog */}
                                <button
                                    className="p-1 m-0 text-2xl w-fit rounded-md transition-all hover:scale-110 duration-300 bg-transparent"
                                    onClick={() => handleEditClick(item)}
                                >
                                    <FcPlus />
                                </button>

                                {/* Delete button */}
                                <button
                                    className="p-1 m-0 text-2xl w-fit rounded-md transition-all hover:scale-110 duration-300 bg-transparent"
                                    onClick={() => handleDeleteItem(item.id)}
                                >
                                    <FcCancel />
                                </button>

                                {/* Complete button (only if not completed yet) */}
                                {!item.tarefa_completo && (
                                    <button
                                        className="p-1 m-0 text-2xl w-fit rounded-md transition-all hover:scale-110 duration-300 bg-transparent"
                                        onClick={() => handleCompleteItem(item.id)}
                                    >
                                        <FcCheckmark />
                                    </button>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                closeOnClick={true}
                pauseOnFocusLoss={false}
                theme="colored"
                draggable={true}
                pauseOnHover={false}
            />
        </div>
    );
}

export default Tasks;
