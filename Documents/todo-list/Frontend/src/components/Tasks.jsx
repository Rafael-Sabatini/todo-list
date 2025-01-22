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

  const [editItem, setEditItem] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      toast.error("Erro ao carregar tarefas", error);
    }
  };

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
      setIsCreateModalOpen(false); // Close the modal after creating the task
    } catch (error) {
      toast.error("Erro ao criar tarefa", error);
    }
  };

  const handleEditClick = (item) => {
    setEditItem({ ...item });
  };

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

  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id);
      loadItems();
      toast.success("Tarefa excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir tarefa", error);
    }
  };

  const handleCompleteItem = async (id) => {
    try {
      await completeItem(id);
      loadItems();
      toast.success("Tarefa concluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao concluir tarefa", error);
    }
  };

  const formatDateTime = (datetimeString) => {
    if (!datetimeString) return "";
    const dateObj = new Date(datetimeString);
    return dateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="text-4xl mt-5">Gerenciador de Tarefas</h1>

      <div className="w-screen p-3">
        <Button
          variant="outlined"
          color="green"
          onClick={() => setIsCreateModalOpen(true)}
          fullWidth>
          Criar nova tarefa
        </Button>
      </div>

      <Dialog
        open={isCreateModalOpen}
        handler={() => setIsCreateModalOpen(false)}>
        <DialogHeader>Criar nova tarefa</DialogHeader>

        <DialogBody divider>
          <Textarea
            className="p-1 rounded-md"
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
        </DialogBody>

        <DialogFooter className="space-x-2">
          <Button
            variant="outlined"
            color="red"
            onClick={() => setIsCreateModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="gradient" color="green" onClick={handleCreateItem}>
            Salvar
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={Boolean(editItem)} handler={() => setEditItem(null)}>
        <DialogHeader>Editar tarefa</DialogHeader>

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
          <Button
            variant="outlined"
            color="red"
            onClick={() => setEditItem(null)}>
            Cancelar
          </Button>
          <Button variant="gradient" color="green" onClick={handleUpdateItem}>
            Salvar
          </Button>
        </DialogFooter>
      </Dialog>

      <h2 className="text-2xl font-semibold mb-2 text-center">
        Lista de Tarefas
      </h2>

      <ul className="p-5 flex flex-col flex-shrink w-screen h-screen">
        {items.map((item) => {
          const textClass = item.tarefa_completo
            ? "line-through text-gray-400"
            : "";

          return (
            <li
              key={item.id}
              className="gap-5 bg-blue-gray-50 p-2 rounded-md shadow-md shadow-l my-2 break-words whitespace-normal">
              <strong className={textClass}>{item.tarefa_nome}</strong>
              <hr className="border-1 border-gray-800" />
              <span className="{textClass} break-words whitespace-normal">
                {item.tarefa_desc}
              </span>
              <br />
              {item.data_criacao && (
                <span>
                  <small className="text-gray-500">
                    Criado em: {formatDateTime(item.data_criacao)}
                  </small>
                </span>
              )}
              <br />
              {item.data_conclusao && (
                <span>
                  <small className="text-gray-500">
                    Concluído em: {formatDateTime(item.data_conclusao)}
                  </small>
                </span>
              )}

              <div className="flex flex-row gap-1 justify-end">
                <button
                  className="p-1 m-0 text-2xl w-fit rounded-md transition-all hover:scale-110 duration-300 bg-transparent"
                  onClick={() => handleEditClick(item)}>
                  <FcPlus />
                </button>

                <button
                  className="p-1 m-0 text-2xl w-fit rounded-md transition-all hover:scale-110 duration-300 bg-transparent"
                  onClick={() => handleDeleteItem(item.id)}>
                  <FcCancel />
                </button>

                {!item.tarefa_completo && (
                  <button
                    className="p-1 m-0 text-2xl w-fit rounded-md transition-all hover:scale-110 duration-300 bg-transparent"
                    onClick={() => handleCompleteItem(item.id)}>
                    <FcCheckmark />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <ToastContainer
        position="bottom-center"
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
