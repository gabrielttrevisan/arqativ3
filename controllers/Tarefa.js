class TarefaController {
  #model;

  constructor({ model }) {
    this.#model = model;

    this.cadastrar = this.cadastrar.bind(this);
    this.listar = this.listar.bind(this);
    this.filtrar = this.filtrar.bind(this);
    this.detalhes = this.detalhes.bind(this);
    this.concluir = this.concluir.bind(this);
    this.excluir = this.excluir.bind(this);
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
      req.query?.filtrarPorConcluidas,
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
      return res.render("tarefas/detalhes", {
        tarefa: null,
        erro: `Nenhum tarefa encontrada para o ID "${id}"`,
      });
    }

    const resposta = this.#model.porId(id);

    res.render("tarefas/detalhes", {
      tarefa: resposta.data || {},
      erro: resposta.erro,
    });
  }

  concluir(req, res) {
    const id = Number(req.params?.id);

    if (!id || isNaN(id) || !isFinite(id)) {
      const respostaListar = this.#model.listar();

      return res.status(400).render("tarefas/index", {
        tarefas: respostaListar.data ?? [],
        erro: `Erro: identificador inválido`,
      });
    }

    const resposta = this.#model.concluir(id);
    const respostaListar = this.#model.listar();

    res.render("tarefas/index", {
      tarefas: respostaListar.data || [],
      erro: resposta.erro || `Sucesso! Tarefa #${id} concluida com sucesso`,
    });
  }

  excluir(req, res) {
    const id = Number(req.params?.id);

    if (!id || isNaN(id) || !isFinite(id)) {
      const respostaListar = this.#model.listar();

      return res.status(400).render("tarefas/index", {
        tarefas: respostaListar.data ?? [],
        erro: `Erro: identificador inválido`,
      });
    }

    const resposta = this.#model.excluir(id);
    const respostaListar = this.#model.listar();

    res.render("tarefas/index", {
      tarefas: respostaListar.data || [],
      erro: resposta.erro || `Sucesso! Tarefa #${id} excluída com sucesso`,
    });
  }
}

export default TarefaController;
