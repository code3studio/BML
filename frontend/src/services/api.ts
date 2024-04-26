import axios from "axios";
import { BACKEND_API } from "../constant";
import { GenerateParamType } from "../types/generate";

export const generateContract = (data: GenerateParamType) => {
  return axios.post(`${BACKEND_API}/generate`, data);
};
