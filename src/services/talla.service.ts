import { tallaRepository } from "../repositories/talla.repository";

export const tallaService = {
  listarPublicas() {
    return tallaRepository.findAll();
  },
};
