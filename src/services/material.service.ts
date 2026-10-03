import { materialRepository } from "../repositories/material.repository";

export const materialService = {
  listarPublicas() {
    return materialRepository.findAll();
  },
};
