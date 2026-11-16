class TarefaController {
  #model;

  constructor({ model }) {
    this.#model = model;

    this.cadastrar = this.cadastrar.bind(this);
    this.listar = this.listar.bind(this);
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
}

export default TarefaController;
