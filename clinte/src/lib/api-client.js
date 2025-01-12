

import axios from "axios"
import { HOST } from "../utils/constent"


export const apiClient = axios.create({
    baseURL: HOST
})


