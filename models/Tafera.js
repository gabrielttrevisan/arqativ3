const STATUS_PENDENTE = "pendente";
const STATUS_CONCLUIDO = "concluído";

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
      id: TarefaModel.#nextId,
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

  #porId(id) {
    const tarefa = this.#tarefas.find((tarefa) => tarefa.id === id);

    if (!tarefa) return null;

    return tarefa;
  }

  porId(id) {
    const tarefa = this.#porId(id);

    if (!tarefa) return { erro: `Tarefa com ID #${id} não encontrada` };

    return { data: structuredClone(tarefa) };
  }

  editar(id, payload) {
    const tarefa = this.#porId(id);

    if (!tarefa) return { error: `Tarefa com ID #${id} não encontrada` };

    if (!payload || typeof payload !== "object")
      return { erro: "Tarefa deve ser um objeto não nulo" };

    const titulo = payload.titulo?.trim();

    if (
      titulo &&
      (typeof titulo !== "string" || titulo.length < 2 || titulo.length > 100)
    )
      return { erro: "O título da tarefa deve ser uma string não vazia" };

    const descricao = payload.descricao?.trim() || null;

    if (descricao && (typeof descricao !== "string" || descricao.length > 500))
      return {
        erro: "A descrição da tarefa deve ser uma string não vazia e com no máximo 500 characteres",
      };

    const disciplina = payload.disciplina?.trim() || null;

    if (
      disciplina &&
      (typeof disciplina !== "string" ||
        disciplina.length < 2 ||
        disciplina.length > 80)
    )
      return {
        erro: "A disciplina da tarefa deve ser uma string com no mínimo 2 e no máximo 500 characteres",
      };

    tarefa.disciplina = disciplina || tarefa.disciplina;
    tarefa.descricao = descricao || tarefa.descricao;
    tarefa.titulo = titulo || tarefa.titulo;

    return { data: tarefa };
  }

  concluir(id) {
    const tarefa = this.#porId(id);

    if (!tarefa) return { erro: `Tarefa com ID #${id} não encontrada` };

    tarefa.status = STATUS_CONCLUIDO;

    return { data: tarefa };
  }

  excluir(id) {
    const indexTarefa = this.#tarefas.findIndex((tarefa) => tarefa.id === id);

    if (indexTarefa === -1)
      return { erro: `Tarefa com ID #${id} não encontrada` };

    if (indexTarefa === 0) return { data: this.#tarefas.shift() };
    else if (indexTarefa === this.#tarefas.length - 1)
      return { data: this.#tarefas.pop() };

    const [removido] = this.#tarefas.splice(indexTarefa, 1);

    return { data: removido };
  }

  filtrar(filtrarPorConcluidas = false) {
    const targetStatus = filtrarPorConcluidas
      ? STATUS_CONCLUIDO
      : STATUS_PENDENTE;
    const lista = this.#tarefas.filter(
      (tarefa) => tarefa.status === targetStatus,
    );

    if (lista.length === 0) return { erro: "Nenhum resultado encontrado" };

    return { data: lista };
  }
}

export default TarefaModel;
