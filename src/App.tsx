import { useState } from "react";
import { useForm } from "react-hook-form";
import "./App.css";

type Fields = {
  /** Name of the lead */
  nombre: string;

  /** Email of the lead */
  email: string;

  /** Country information */
  pais: {
    pais_nombre: string;
    pais_id: string;
  };

  /** Phone number of the lead */
  telefono: string;

  /** Career information */
  carrera: {
    carrera_nombre: string;
    carrera_id: string;
  };
};

function App() {
  const { handleSubmit, register } = useForm();

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      ></form>
    </>
  );
}

export default App;
