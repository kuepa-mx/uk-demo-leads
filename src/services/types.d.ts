declare type Career = {
  carrera_id: string;
  carrera_nombre: string;
  carrera_codigo: string;
  carrera_activo: boolean;
  cuenta: {
    cuenta_id: string;
    cuenta_tipo: string;
    cuenta_cantidad_cuotas: number;
    cuenta_activo: boolean;
  };
};

declare type Country = {
  pais_id: string;
  pais_nombre: string;
  pais_moneda: string;
  pais_activo: boolean;
};

declare type Paginated<Item> = {
  data: Item[];
  total: number;
  page: number;
  limit: number;
  error?: string;
};

declare type Product = {
  producto_id: string;
  nombre_producto: string;
  descripcion_producto: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
};

declare type Owner = {
  owner_id: string;
  owner_nombre: string;
  owner_email: string;
  owner_activo: boolean;
};

declare type Status = {
  status_id: string;
  status_nombre:
    | "No contactado"
    | "Matriculado"
    | "Contactado"
    | "En proceso de pago"
    | "Convertido"
    | "No interesado";
  status_activo: boolean;
};
