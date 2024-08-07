import React, { useState } from "react";
import { OdontogramType } from "../../../types/dtos/Patient/NewPatient.type";
import "./Odontogram.css";

interface OdontogramFormProps {
  odontogramData: OdontogramType[];
  setOdontogramData: React.Dispatch<React.SetStateAction<OdontogramType[]>>;
}

const FDI_TEETH_NUMBERS = new Set([
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 38, 37, 36,
  35, 34, 33, 32, 31, 48, 47, 46, 45, 44, 43, 42, 41, 51, 52, 53, 54, 55, 61,
  62, 63, 64, 65, 71, 72, 73, 74, 75, 81, 82, 83, 84, 85,
]);
const VALID_PARTS = ["top", "left", "right", "bottom", "center"];
const VALID_REFS = [
  "Prestaciones Existentes",
  "Prestaciones Requeridas",
  "Diente ausente o a extraer",
  "Prótesis fija/removible",
  "Corona",
];

export const OdontogramForm: React.FC<OdontogramFormProps> = ({
  odontogramData,
  setOdontogramData,
}) => {
  const [currentTooth, setCurrentTooth] = useState<OdontogramType>({
    toothNumber: 0,
    parts: [],
    ref: "",
  });
  const [error, setError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentTooth({
      ...currentTooth,
      [name]: name === "toothNumber" ? parseInt(value) : value,
    });
  };

  const handlePartsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let parts: string[] = [];

    if (value === "all") {
      parts = ["top", "bottom", "left", "right", "center"];
    } else if (VALID_PARTS.includes(value)) {
      parts = [value];
    }

    setCurrentTooth((prev) => ({
      ...prev,
      parts,
    }));
  };

  const addTooth = () => {
    const { toothNumber, parts, ref } = currentTooth;
    if (!FDI_TEETH_NUMBERS.has(toothNumber)) {
      setError("Número de diente no válido.");
      return;
    }
    if (
      parts.length === 0 ||
      !parts.every((part) => VALID_PARTS.includes(part))
    ) {
      setError(
        parts.length === 0
          ? "Debe seleccionar una parte del diente."
          : "Parte del diente no válida."
      );
      return;
    }
    if (!VALID_REFS.includes(ref)) {
      setError("Debe seleccionar una prestación dental.");
      return;
    }
    setOdontogramData((prev) => [...prev, currentTooth]);
    setCurrentTooth({ toothNumber: 0, parts: [], ref: "" });
    setError("");
  };

  const resetOdontogramData = () => {
    setOdontogramData([]);
    setCurrentTooth({ toothNumber: 0, parts: [], ref: "" });
    setError("");
  };

  const selectedOption =
    currentTooth.parts.length === 5 &&
    VALID_PARTS.every((part) => currentTooth.parts.includes(part))
      ? "all"
      : currentTooth.parts[0] || "";

  return (
    <div className="mt-2 p-2 border border-[#424242] rounded-[10px] w-[290px] mb-2">
      <div className="mb-2">
        <label htmlFor="toothNumber" className="block font-medium text-[13px]">
          N° diente<span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="toothNumber"
          name="toothNumber"
          value={currentTooth.toothNumber}
          onChange={handleInputChange}
          className="inputs-prestation shadow-sm"
        />
        {error === "Número de diente no válido." && (
          <p className="text-red-500 text-[13px]">{error}</p>
        )}
      </div>
      <div className="mb-2">
        <label htmlFor="parts" className="block font-medium text-[13px]">
          Cara del diente<span className="text-red-500">*</span>
        </label>
        <select
          id="parts"
          name="parts"
          value={selectedOption}
          onChange={handlePartsChange}
          className="inputs-prestation shadow-sm"
        >
          <option value="">Selecciona una cara</option>
          <option value="all">Todo el diente</option>
          <option value="top">Arriba</option>
          <option value="bottom">Abajo</option>
          <option value="left">Izquierda</option>
          <option value="right">Derecha</option>
          <option value="center">Centro</option>
        </select>
        {(error === "Debe seleccionar una parte del diente." ||
          error === "Parte del diente no válida.") && (
          <p className="text-red-500 text-[13px]">{error}</p>
        )}
      </div>
      <div className="mb-2">
        <label htmlFor="ref" className="block font-medium text-[13px]">
          Prestación<span className="text-red-500">*</span>
        </label>
        <select
          id="ref"
          name="ref"
          value={currentTooth.ref}
          onChange={handleInputChange}
          className="inputs-prestation shadow-sm"
        >
          <option value="">Seleccione una prestación</option>
          <option value="Prestaciones Existentes">
            Prestaciones Existentes
          </option>
          <option value="Prestaciones Requeridas">
            Prestaciones Requeridas
          </option>
          <option value="Diente ausente o a extraer">
            Diente ausente o a extraer
          </option>
          <option value="Prótesis fija/removible">
            Prótesis fija/removible
          </option>
          <option value="Corona">Corona</option>
        </select>
        {error === "Debe seleccionar una prestación dental." && (
          <p className="text-red-500 text-[13px]">{error}</p>
        )}
      </div>
      <div className="flex justify-between pt-2">
        {odontogramData.length > 0 ? (
          <button
            className="bg-red-500 text-gray-100 py-1 px-2 rounded-[8px]"
            type="button"
            onClick={resetOdontogramData}
          >
            Resetear
          </button>
        ) : (
          <div></div>
        )}
        <button
          className="bg-acento poppins-medium py-1 px-2 rounded-[8px]"
          type="button"
          onClick={addTooth}
        >
          Agregar
        </button>
      </div>
    </div>
  );
};
