const STATUS_PENDENTE = "pendente";
const STATUS_CONCLUIDO = "concluido";

class TarefaModel {
  static #previousId = 0;

  static get #nextId() {
    return ++TarefaModel.#previousId;
  }

  #tarefas = [];

  cadastrar(payload) {
    if (!payload || typeof payload !== "object")
      return { erro: "Tarefa deve ser um objeto não nulo" };

    const titulo = payload.titulo?.trim();

    if (
      !titulo ||
      typeof titulo !== "string" ||
      titulo.length < 2 ||
      titulo.length > 100
    )
      return { erro: "O título da tarefa deve ser uma string não vazia" };

    const descricao = payload.descricao?.trim() || null;

    if (descricao && (typeof descricao !== "string" || descricao.length > 500))
      return {
        erro: "A descrição da tarefa deve ser uma string não vazia e com no máximo 500 characteres",
      };

    const disciplina = payload.disciplina?.trim() || null;

    if (
      !disciplina ||
      typeof disciplina !== "string" ||
      disciplina.length < 2 ||
      disciplina.length > 80
    )
      return {
        erro: "A disciplina da tarefa deve ser uma string com no mínimo 2 e no máximo 500 characteres",
      };

    const novaTarefa = {
      id: ++TarefaModel.#nextId,
      titulo,
      descricao,
      disciplina,
      status: STATUS_PENDENTE,
    };

    this.#tarefas.push(novaTarefa);

    return {
      data: novaTarefa,
    };
  }

  listar() {
    return {
      data: structuredClone(this.#tarefas),
    };
  }

  porId(id) {
    const tarefa = this.#tarefas.find((tarefa) => tarefa.id === id);

    if (!tarefa) return { erro: `Tarefa com ID #${id} não encontrada` };
  }
}
