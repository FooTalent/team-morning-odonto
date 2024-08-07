import axios from "axios";
import {
  Prestations,
  OdontogramType,
} from "../../../../types/dtos/Patient/NewPatient.type";
import { PRESTATION_PATHS } from "../../../../constants/paths/prestationsPatch";
import { token } from "../../../../localStorage/token";

const { PRESTATION_UPDATE } = PRESTATION_PATHS;

export const updatePrestation = async (
  prestation: Omit<Prestations, "odontogram">,
  odontogram: OdontogramType[]
) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}${PRESTATION_UPDATE}`,
      {
        ...prestation,
        odontogram,
      },
      {
        headers: { Authorization: `Bearer ${token()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating prestation:", error);
    throw error;
  }
};
