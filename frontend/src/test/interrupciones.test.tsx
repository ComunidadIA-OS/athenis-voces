/**
 * Pruebas del registro de interrupciones: con muchos eventos solo se ven los primeros y el resto
 * se despliega a petición, para que la pantalla de resultados no mida miles de píxeles.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InterrupcionesTable } from "../components/InterrupcionesTable";
import type { Interrupcion } from "../types/contrato";

function eventos(n: number): Interrupcion[] {
  return Array.from({ length: n }, (_, i) => ({
    inicio: i * 10,
    fin: i * 10 + 2,
    interrumpe: 1,
    interrumpido: 2,
    tipo: i % 2 === 0 ? "con_exito" : "senal_de_escucha",
  }));
}

function filasDeDatos() {
  return screen.getAllByRole("row").length - 1;
}

describe("registro de interrupciones", () => {
  it("con muchos eventos enseña solo los primeros y el resto, a petición", () => {
    render(<InterrupcionesTable interrupciones={eventos(25)} duracion={600} onPlay={() => {}} />);

    expect(filasDeDatos()).toBe(10);
    fireEvent.click(screen.getByRole("button", { name: /Mostrar los 15 restantes/ }));

    expect(filasDeDatos()).toBe(25);
    expect(screen.queryByRole("button", { name: /Mostrar los/ })).not.toBeInTheDocument();
  });

  it("con pocos eventos no ofrece desplegar nada", () => {
    render(<InterrupcionesTable interrupciones={eventos(8)} duracion={600} onPlay={() => {}} />);

    expect(filasDeDatos()).toBe(8);
    expect(screen.queryByRole("button", { name: /Mostrar los/ })).not.toBeInTheDocument();
  });

  it("al cambiar de filtro vuelve a las primeras filas", () => {
    render(<InterrupcionesTable interrupciones={eventos(40)} duracion={600} onPlay={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Mostrar los 30 restantes/ }));
    expect(filasDeDatos()).toBe(40);
    fireEvent.click(screen.getByRole("button", { name: /Solo interrupciones/ }));

    expect(filasDeDatos()).toBe(10);
    expect(screen.getByRole("button", { name: /Mostrar los 10 restantes/ })).toBeInTheDocument();
  });
});
