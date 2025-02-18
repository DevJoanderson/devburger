import express from "express";
import routes from "./routes.js";

class App {
  constructor() {
    this.app = express();

    this.middlewares();
    this.routes();

    // O middleware de erro deve vir depois das rotas
    this.errorHandler();
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use(routes);
  }

  // Middleware global para captura de erros
  errorHandler() {
    this.app.use((err, req, res, next) => {
      console.error("Erro capturado:", err.stack);

      res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err : {}, // Exibe detalhes no modo dev
      });

      next(err); // Passa o erro adiante, caso tenha outros middlewares de erro
    });
  }
}

export default new App().app;
