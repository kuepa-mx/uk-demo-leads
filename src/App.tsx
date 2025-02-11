import { Controller, useForm } from "react-hook-form";
import { Menubar } from "primereact/menubar";
import { Card } from "primereact/card";
import { useQuery } from "react-query";
import {
  createLead,
  getCountries,
  getOwners,
  getProducts,
  getStatus,
} from "./services";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { classNames } from "primereact/utils";
import validationSchema, { Fields } from "./schema/lead.schema";
import { yupResolver } from "@hookform/resolvers/yup";

const textFields = ["nombre", "email", "telefono"] as (keyof Fields)[];
const labels: Record<keyof Fields, string> = {
  nombre: "Nombre",
  email: "Correo",
  producto: "Producto",
  pais: "País",
  telefono: "Teléfono",
  owner: "Owner",
  status: "Status",
};

function App() {
  const toast = useRef<Toast>(null);
  const { data: products, isLoading: isProductsLoading } = useQuery(
    "careers",
    getProducts
  );
  const { data: statuses, isLoading: isStatusesLoading } = useQuery(
    "statuses",
    getStatus
  );
  const { data: owners, isLoading: isOwnersLoading } = useQuery(
    "owners",
    getOwners
  );
  const { data: countries, isLoading: isCountriesLoading } = useQuery(
    "countries",
    getCountries
  );
  const { handleSubmit, control, formState } = useForm<Fields>({
    defaultValues: {
      producto: "",
      email: "",
      nombre: "",
      pais: "",
      telefono: "",
      owner: "",
      status: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const onSuccess: Parameters<typeof handleSubmit>[0] = async (data) => {
    await createLead({
      ...data,
      telefono_lada: data.telefono,
      status: {
        status_id: data.status,
      },
      pais: {
        pais_id: data.pais,
      },
      producto: {
        producto_id: data.producto,
      },
      owner: {
        owner_id: data.owner,
      },
    })
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Lead creado exitosamente",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Ha ocurrido un error al crear",
        });
      });
  };
  const onError: Parameters<typeof handleSubmit>[1] = (error) => {
    if (error) {
      console.log(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "Hay errores en el formulario, corrijalos e intente nuevamente.",
        life: 5000,
      });
      return;
    }
  };

  const Field = ({
    name,
    input,
    label,
    className = "",
  }: {
    input: React.ReactNode;
    name: keyof Fields;
    label: string;
    className?: string;
  }) => (
    <div className={`field flex flex-col mx-2 my-2 grow-0 ${className}`}>
      <FloatLabel>
        {input}
        <label htmlFor={name}>{label}</label>
      </FloatLabel>
      <p className="error text-red-300 ml-1 mt-1">
        {formState.errors[name]?.message}
      </p>
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <nav>
        <Menubar />
      </nav>
      <main className="grid align-middle">
        <Card
          title={<h1 className="mb-6 text-center">Crear Lead</h1>}
          className="sm:mx-auto max-w-screen-xl mx-6 p-6 shadow-lg"
          pt={{
            content: { className: "p-0" },
            title: { className: "vertical-align-middle" },
            body: { className: "p-0" },
          }}
        >
          <form
            onSubmit={handleSubmit(onSuccess, onError)}
            className={classNames(
              "flex flex-col sm:grid sm:grid-cols-[50%_50%] relative",
              {
                "opacity-50 pointer-events-none":
                  formState.isSubmitting || formState.isLoading,
              }
            )}
          >
            {textFields.map((name) => (
              <Field
                key={name}
                name={name}
                label={labels[name]}
                input={
                  <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <InputText
                        {...field}
                        {...(name === "telefono" && { type: "tel" })}
                        {...(name === "email" && { type: "email" })}
                      />
                    )}
                  />
                }
              />
            ))}
            <Field
              name="pais"
              label="Pais"
              input={
                <Controller
                  name="pais"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      options={countries?.data}
                      loading={isCountriesLoading}
                      filter
                      className="w-full grow-0"
                      optionLabel="pais_nombre"
                      optionValue="pais_id"
                    />
                  )}
                />
              }
            />
            <Field
              name="producto"
              label="Producto"
              className="col-span-2"
              input={
                <Controller
                  name="producto"
                  rules={{ required: "Producto es requerido" }}
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      options={products?.data}
                      loading={isProductsLoading}
                      filter
                      className="w-full"
                      optionLabel="nombre_producto"
                      optionValue="producto_id"
                    />
                  )}
                />
              }
            />
            <Field
              name="owner"
              label="Owner"
              className="col-span-2"
              input={
                <Controller
                  name="owner"
                  rules={{ required: "Owner es requerido" }}
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      options={owners?.data}
                      loading={isOwnersLoading}
                      filter
                      className="w-full"
                      optionLabel="owner_nombre"
                      optionValue="owner_id"
                    />
                  )}
                />
              }
            />
            <Field
              name="status"
              label="Status"
              className="col-span-2"
              input={
                <Controller
                  name="status"
                  rules={{ required: "Status es requerido" }}
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      options={statuses?.data}
                      loading={isStatusesLoading}
                      filter
                      className="w-full"
                      optionLabel="status_nombre"
                      optionValue="status_id"
                    />
                  )}
                />
              }
            />
            {(formState.isLoading || formState.isSubmitting) && (
              <ProgressSpinner className="absolute m-auto top-0 left-0 right-0 bottom-0" />
            )}
            <Button
              disabled={formState.isSubmitting}
              className="col-span-2 px-8 w-fit m-2 mt-8 ml-auto"
            >
              Crear
            </Button>
          </form>
        </Card>
      </main>
    </>
  );
}

export default App;
