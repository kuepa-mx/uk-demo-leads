import { Axios } from "axios";

const baseURL: string = import.meta.env.VITE_API_URL;
const client = new Axios({ baseURL });

async function getRecords<T>(path: string): Promise<Paginated<T>> {
  try {
    const { data } = await client.get(`/records/all/${path}`);

    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return {
      data: [],
      total: 0,
      page: 0,
      limit: 0,
      error: `Error al obtener los registros de ${path}`,
    };
  }
}

export async function getCountries() {
  return getRecords<Country>("pais");
}

export async function getCareers() {
  return getRecords<Career>("carrera");
}

export async function getProducts() {
  return getRecords<Product>("producto");
}

export async function getOwners() {
  return getRecords<Owner>("owner");
}

export async function getStatus() {
  return getRecords<Status>("status");
}

export async function createLead(data: {
  nombre: string;
  email: string;
  telefono_lada: string; // CON LADA
  pais: {
    pais_id: string;
  };
  producto: {
    producto_id: string;
  };
  owner: {
    owner_id: string;
  };
  status: {
    status_id: string;
  };
}) {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const formattedTime = today.toTimeString().split(" ")[0].substring(0, 5);

  const body = {
    nombre: data.nombre,
    email: data.email,
    pais: data.pais,
    producto: data.producto,
    status: data.status,
    owner: data.owner,
    telefono_lada: data.telefono_lada,
    fecha_creacion: formattedDate,
    hora_creacion: formattedTime,
    contactado_sin_exito: false,
    fecha_contacto_futuro: "2024-12-20",
    hora_contacto_futuro: "09:00",
    keywords: "educación, tecnología",
    sitio_web: "https://example.com",
    no_interesado: {
      no_interesado_id: "1b5de72a-bed8-4b09-ad11-749f07c9a590",
    },
    rating: {
      rating_id: "0fa9ea31-0267-47aa-9f20-6ccdaa0e0b67",
    },
    lead_activo: true,
  };

  const req = await client.post(`/records/lead`, JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (req.status >= 400) throw new Error(req.statusText);
}
