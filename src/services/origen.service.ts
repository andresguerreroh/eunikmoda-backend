import { origenRepository } from "../repositories/origen.repository";

export const origenService = {
  listarPublicas() {
    return origenRepository.findAll();
  },
};
