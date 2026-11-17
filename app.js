import path from "node:path";
import TarefaController from "./controllers/Tarefa.js";
import TarefaModel from "./models/Tafera.js";
import express from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const tarefaController = new TarefaController({ model: new TarefaModel() });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.redirect("/tarefas");
});

app.get("/tarefas", tarefaController.listar);
app.get("/tarefas/filtrar", tarefaController.filtrar);
app.get("/tarefas/detalhes/:id", tarefaController.detalhes);
app.get("/tarefas/concluir/:id", tarefaController.concluir);
app.get("/tarefas/excluir/:id", tarefaController.excluir);
app.post("/tarefas", tarefaController.cadastrar);

app.listen(3000, () => {
  console.log("Acesse http://localhost:3000");
});
