class TarefaController {
  #model;

  constructor({ model }) {
    this.#model = model;

    this.cadastrar = this.cadastrar.bind(this);
    this.listar = this.listar.bind(this);
    this.filtrar = this.filtrar.bind(this);
    this.detalhes = this.detalhes.bind(this);
  }

  cadastrar(req, res) {
    const resultado = this.#model.cadastrar(req.body);

    if (resultado.erro) {
      const resposta = this.#model.listar();

      return res.status(400).render("tarefas/index", {
        tarefas: resposta.data ?? [],
        erro: resultado.erro,
      });
    }

    return res.redirect(303, "/tarefas");
  }

  listar(_, res) {
    const resposta = this.#model.listar();

    res.render("tarefas/index", {
      tarefas: resposta.data ?? [],
      erro: resposta.erro,
    });
  }

  filtrar(req, res) {
    const filtrarPorConcluidas = ["1", "true", 1, true].includes(
      req.body?.filtrarPorConcluidas,
    );

    const resposta = this.#model.filtrar(filtrarPorConcluidas);

    res.render("tarefas/filtrar", {
      tarefas: resposta.data ?? [],
      tituloEstado: filtrarPorConcluidas ? "Concluídas" : "Pendentes",
    });
  }

  detalhes(req, res) {
    const id = Number(req.params?.id);

    if (!id || isNaN(id) || !isFinite(id)) {
      const resposta = this.#model.listar();

      return res.status(400).render("tarefas/index", {
        tarefas: resposta.data ?? [],
        erro: `Identificador da tarefa inválido`,
      });
    }

    const resposta = this.#model.porId(id);

    res.render("tarefas/detalhes", {
      tarefa: resposta.data || {},
      erro: resposta.erro,
    });
  }
}

export default TarefaController;
