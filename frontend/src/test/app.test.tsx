import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../App";

/** Códigos del funcional (RF-14, RN-07, D-18…) o secciones (8.3, Sección 8.4) en el texto visible. */
const CODIGO_INTERNO =
  /\b(RF|RNF|RN|RD|FR|SC|MD|M|D)-\d+|\(\d+\.\d+[,)]|Sección \d|\bv\d+\.\d+|Contrato \d/;

describe("Aplicación Athenis Voces Frontend", () => {
  it("renderiza la barra de navegación con el título del proyecto", () => {
    render(<App />);
    expect(screen.getByText("Athenis Voces")).toBeInTheDocument();
    expect(screen.queryByText("v0.2")).not.toBeInTheDocument();
    expect(screen.getByText("1. Analizar")).toBeInTheDocument();
    expect(screen.getByText("Cómo funciona")).toBeInTheDocument();
  });

  it("muestra el aviso de privacidad obligatorio antes de subir audio (8.4)", () => {
    render(<App />);
    expect(
      screen.getByText(/Analizaremos solo las voces de este audio, no lo que se dice/i),
    ).toBeInTheDocument();
  });

  it("no muestra el selector de modo manual", () => {
    render(<App />);
    expect(screen.queryByText(/Modo manual: confirmar las voces/i)).not.toBeInTheDocument();
  });

  it("no muestra referencias internas de requisitos en los ejemplos", () => {
    render(<App />);
    expect(screen.queryByText(/RF-02, RNF-02/i)).not.toBeInTheDocument();
  });

  it("los ejemplos dicen que nadie confirmó sus voces y muestran la duración en minutos", () => {
    render(<App />);
    expect(screen.queryByText(/confirmación validada/i)).not.toBeInTheDocument();
    expect(screen.getByText(/resultados del sistema sobre reuniones reales/i)).toBeInTheDocument();
    expect(screen.getByText("31m 22s · 4 voces")).toBeInTheDocument();
    expect(screen.getByText("49m 20s · 4 voces")).toBeInTheDocument();
  });

  it("permite seleccionar un ejemplo precalculado y ver resultados directamente", async () => {
    render(<App />);
    const botonVerResultados = screen.getAllByText("Ver resultados")[0];
    fireEvent.click(botonVerResultados);

    // Debe navegar a Resultados y mostrar el aviso ético obligatorio de la sección 8.4
    expect(
      await screen.findByText(/Estos datos describen este episodio, no a las personas/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Resultados del análisis acústico")).toBeInTheDocument();
  });

  it("permite navegar a la página 'Metodología'", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Metodología"));

    expect(screen.getByText("¿Qué es Athenis?")).toBeInTheDocument();
    expect(screen.getByText("Ética y diseño responsable")).toBeInTheDocument();
  });

  it("el inicio y 'Metodología' no muestran códigos internos de requisitos", () => {
    render(<App />);
    expect(document.body.textContent).not.toMatch(CODIGO_INTERNO);

    fireEvent.click(screen.getByText("Metodología"));
    expect(document.body.textContent).not.toMatch(CODIGO_INTERNO);
  });

  it("los tooltips no muestran códigos internos de requisitos", async () => {
    render(<App />);
    fireEvent.click(screen.getAllByText("Ver resultados")[0]);
    await screen.findByText("Resultados del análisis acústico");

    const titulos = [...document.querySelectorAll("[title]")].map((e) => e.getAttribute("title"));
    expect(titulos.join(" | ")).not.toMatch(CODIGO_INTERNO);
  });

  it("'Cómo funciona' no muestra códigos internos de requisitos", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Cómo funciona"));

    expect(document.body.textContent).not.toMatch(CODIGO_INTERNO);
  });

  it("los términos del glosario y la etiqueta de transparencia no muestran códigos internos", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Cómo funciona"));

    expect(screen.getByText("Transparencia y Explicabilidad")).toBeInTheDocument();
    expect(screen.getByText("Turno de habla")).toBeInTheDocument();
    expect(screen.getByText("Solapamiento")).toBeInTheDocument();
    expect(
      screen.getByText("Interrupción con éxito vs Intento vs Señal de escucha"),
    ).toBeInTheDocument();
    expect(screen.getByText("Voces presentes vs Voces cortas")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(
      /Transparencia y Explicabilidad \(RF-22\)|Turno de habla \(RF-05\)|Solapamiento \(RF-05\)|Interrupción con éxito vs Intento vs Señal de escucha \(RF-14, RN-07\)|Voces presentes vs Voces cortas \(RN-01, D-15, D-18\)/,
    );
    expect(screen.getByText("Fórmulas matemáticas auditables")).toBeInTheDocument();
    expect(screen.queryByText("Fórmulas matemáticas auditables (RN-06)")).not.toBeInTheDocument();
  });

  it("los resultados no muestran códigos internos de requisitos", async () => {
    render(<App />);
    fireEvent.click(screen.getAllByText("Ver resultados")[0]);
    await screen.findByText("Resultados del análisis acústico");

    expect(document.body.textContent).not.toMatch(CODIGO_INTERNO);
  });

  it("permite navegar a la página 'Cómo funciona' (RF-22)", () => {
    render(<App />);
    const tabComoFunciona = screen.getByText("Cómo funciona");
    fireEvent.click(tabComoFunciona);

    expect(screen.getByText("Cómo funciona Athenis Voces")).toBeInTheDocument();
    expect(screen.getByText(/Glosario acústico y conversacional/i)).toBeInTheDocument();
  });
});
