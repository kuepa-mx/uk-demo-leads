import { Controller, useForm } from "react-hook-form";
import { Menubar } from "primereact/menubar";
import { Card } from "primereact/card";
import { useQuery } from "react-query";
import { createLead, getCareers, getCountries } from "./services";
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

function App() {
  const toast = useRef<Toast>(null);
  const { data: careers, isLoading: isCareersLoading } = useQuery(
    "careers",
    getCareers
  );
  const { data: countries, isLoading: isCountriesLoading } = useQuery(
    "countries",
    getCountries
  );
  const { handleSubmit, register, control, formState } = useForm<Fields>({
    defaultValues: {
      carrera: "",
      email: "",
      nombre: "",
      pais: "",
      telefono: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const onSuccess: Parameters<typeof handleSubmit>[0] = async (data) => {
    await createLead({
      ...data,
      pais: {
        pais_id: data.pais,
      },
      carrera: {
        carrera_id: data.carrera,
      },
    })
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Lead Guardado exitosamente",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Ha ocurrido un error al guardar",
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
  }: {
    input: React.ReactNode;
    name: keyof Fields;
    label: string;
  }) => (
    <div className="field flex flex-col">
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
          className="w-fit mx-auto p-4"
          pt={{
            content: { className: "p-0" },
            title: { className: "vertical-align-middle" },
          }}
        >
          <form
            onSubmit={handleSubmit(onSuccess, onError)}
            className={classNames("grid grid-cols-2 gap-4 relative", {
              "opacity-50 pointer-events-none":
                formState.isSubmitting || formState.isLoading,
            })}
          >
            <Field
              name="nombre"
              label="Nombre"
              input={
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field }) => <InputText {...field} />}
                />
              }
            />
            <Field
              name="email"
              label="E-mail"
              input={
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <InputText {...field} />}
                />
              }
            />
            <Field
              name="telefono"
              label="Telefono"
              input={
                <Controller
                  name="telefono"
                  control={control}
                  render={({ field }) => <InputText {...field} />}
                />
              }
            />
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
                      options={countries}
                      loading={isCountriesLoading}
                      filter
                      className="w-full"
                      optionLabel="pais_nombre"
                      optionValue="pais_id"
                    />
                  )}
                />
              }
            />
            <Field
              name="carrera"
              label="Carrera"
              input={
                <Controller
                  name="carrera"
                  rules={{ required: "Carrera es requerido" }}
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      options={careers}
                      loading={isCareersLoading}
                      filter
                      className="w-full"
                      optionLabel="carrera_nombre"
                      optionValue="carrera_id"
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
              className="col-span-2 px-6 w-fit mt-4 ml-auto"
            >
              Guardar
            </Button>
          </form>
        </Card>
      </main>
    </>
  );
}

export default App;
