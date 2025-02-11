import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .required("Nombre es requerido")
    .min(2, "Nombre debe tener al menos 2 caracteres")
    .max(50, "Nombre no puede tener más de 50 caracteres"),

  email: Yup.string()
    .required("Email es requerido")
    .email("Debe ser un email válido"),

  pais: Yup.string().required("Pais es requerido"),

  telefono: Yup.string()
    .required("Telefono es requerido")
    .matches(/^\d+$/, "El teléfono solo puede contener números")
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(15, "El teléfono no puede exceder los 15 dígitos"),

  producto: Yup.string().required("Producto es requerido"),
  status: Yup.string().required("Status es requerido"),
  owner: Yup.string().required("Owner es requerido"),
});

export type Fields = Yup.InferType<typeof validationSchema>;

export default validationSchema;
