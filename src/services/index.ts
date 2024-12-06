import { Axios } from "axios";

const API_URL: string = import.meta.env.VITE_API_URL;

export async function getCountries() {
  const data = await import("../data/countries.json");
  return data.default;
}

export async function getCareers() {
  const data = await import("../data/careers.json");
  return data.default;
}

const client = new Axios({ baseURL: API_URL });

type Body = {
  nombre: string;
  email: string;
  telefono: string; // CON LADA
  pais: {
    pais_id: string;
  };
  carrera: {
    carrera_id: string;
  };
};

const MOCK = false;

export async function createLead(data: Body) {
  if (MOCK) {
    return new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, 3000);
    });
  }

  const body = { requestType: "create.lead", data };
  const req = await client.post(
    `/broker/v1/request/lead/new`,
    JSON.stringify(body),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (req.status !== 200) throw new Error(req.statusText);
}
