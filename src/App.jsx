import { useState } from "react";

function App() {
  const [interes, setInteres] = useState("");
  const [amantes, setAmantes] = useState([]);

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [interesesNuevo, setInteresesNuevo] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const buscar = async () => {
    setMensaje("");
    setError("");

    try {
      const res = await fetch(
        `http://localhost:3000/amantes?interes=${encodeURIComponent(interes)}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al buscar");
      }

      setAmantes(data);
    } catch (err) {
      setAmantes([]);
      setError(err.message);
    }
  };

  const crearAmante = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const amante = {
        nombre,
        edad: Number(edad),
        intereses: interesesNuevo
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      };

      const res = await fetch("http://localhost:3000/amantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(amante),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear amante");
      }

      setMensaje(`Amante creado correctamente: ${data.nombre}`);
      setNombre("");
      setEdad("");
      setInteresesNuevo("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Amante Ideal</h1>
      <p>Registro y búsqueda de posibles amantes por interés.</p>

      <hr />

      <h2>Crear amante</h2>
      <form
        onSubmit={crearAmante}
        style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />

        <input
          type="text"
          placeholder="Intereses separados por coma"
          value={interesesNuevo}
          onChange={(e) => setInteresesNuevo(e.target.value)}
        />

        <button type="submit">Crear</button>
      </form>

      <hr />

      <h2>Buscar por interés</h2>
      <input
        type="text"
        placeholder="Buscar interés (ej: cine)"
        value={interes}
        onChange={(e) => setInteres(e.target.value)}
      />

      <button onClick={buscar} style={{ marginLeft: "10px" }}>
        Buscar
      </button>

      {mensaje && <p style={{ color: "green", fontWeight: "bold" }}>{mensaje}</p>}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <h2>Resultados</h2>
      <ul>
        {amantes.map((a) => (
          <li key={a._id}>
            <strong>{a.nombre}</strong> - {a.edad} años
            <br />
            Intereses: {a.intereses.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;