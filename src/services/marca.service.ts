import { marcaRepository } from "../repositories/marca.repository";

export const marcaService = {
  listarPublicas() {
    return marcaRepository.findAllActive();
  },
};
