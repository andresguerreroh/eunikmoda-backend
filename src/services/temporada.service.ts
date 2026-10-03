import { temporadaRepository } from "../repositories/temporada.repository";

export const temporadaService = {
  listarPublicas() {
    return temporadaRepository.findAll();
  },
};
