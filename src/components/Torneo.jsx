import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaUserFriends,
  FaTrophy,
  FaUsers,
  FaCalendarAlt,
  FaCoins,
  FaSignOutAlt,
  FaLock,
  FaSpinner,
  FaTimes,
  FaArrowLeft,
  FaPlay,
  FaExclamationTriangle,
} from "react-icons/fa";
import { tournamentApi } from "../services/api/tournamentApi";
import { getToken } from "../services/api/authApi";
import { jwtDecode } from "jwt-decode";
import NavBarGame from "./layout/game/NavbarGame";
import BackButton from "./layout/game/BackButton";
import background from "../assets/background.png";
import { useTranslation } from "react-i18next";

const initialState = {
  torneos: [],
  torneoSeleccionado: null,
  loading: { global: true, action: false, torneoId: null },
  error: null,
  filtros: { busqueda: "", soloDisponibles: true },
  modal: { password: false, crear: false },
  form: {
    nombre: "",
    descripcion: "",
    premio: "",
    contrasena: "",
    esPrivado: false,
  },
  formErrors: {
    nombre: "",
    descripcion: "",
    premio: "",
    contrasena: "",
  },
  torneoParaUnirse: null,
  passwordInput: "",
  initialCheckDone: false,
};

const Torneo = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const { t } = useTranslation();

  const user = useMemo(() => {
    const token = getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decodificando token:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const cargarTorneos = async () => {
      try {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, global: true },
          error: null,
        }));
        const data = await tournamentApi.obtenerTorneosActivos();
        setState((prev) => ({
          ...prev,
          torneos: data,
          loading: { ...prev.loading, global: false },
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err.message,
          loading: { ...prev.loading, global: false },
        }));
      }
    };
    cargarTorneos();
  }, []);

  useEffect(() => {
    const checkUserTorneos = async () => {
      if (user && !state.initialCheckDone && !state.loading.global) {
        try {
          const jugados = await tournamentApi.obtenerTorneosJugador();
          if (Array.isArray(jugados) && jugados.length > 0) {
            const pendiente = jugados.find((t) => t.ganador_id == null);
            if (pendiente) {
              verDetalles(pendiente.id);
            }
          }
        } catch (err) {
          console.error("Error al obtener torneos jugados:", err);
        } finally {
          setState((prev) => ({ ...prev, initialCheckDone: true }));
        }
      }
    };
    checkUserTorneos();
  }, [state.loading.global, user]);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      nombre: "",
      descripcion: "",
      premio: "",
      contrasena: "",
    };

    if (!state.form.nombre.trim()) {
      errors.nombre = t("tournament.errors.nameRequired");
      isValid = false;
    } else if (state.form.nombre.trim().length < 4) {
      errors.nombre = t("tournament.errors.nameLength");
      isValid = false;
    }

    if (!state.form.descripcion.trim()) {
      errors.descripcion = t("tournament.errors.descriptionRequired");
      isValid = false;
    }

    if (!state.form.premio.trim()) {
      errors.premio = t("tournament.errors.rewardRequired");
      isValid = false;
    } else if (isNaN(Number(state.form.premio))) {
      errors.premio = t("tournament.errors.rewardInvalid");
      isValid = false;
    }

    if (state.form.esPrivado && !state.form.contrasena.trim()) {
      errors.contrasena = t("tournament.errors.passwordRequired");
      isValid = false;
    }

    setState((prev) => ({
      ...prev,
      formErrors: errors,
    }));

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [name]: type === "checkbox" ? checked : value,
      },
      formErrors: {
        ...prev.formErrors,
        [name]: "", // Limpiar el error cuando el usuario modifica el campo
      },
    }));
  };

  const torneosFiltrados = state.torneos.filter((torneo) => {
    const coincideBusqueda = torneo.nombre
      .toLowerCase()
      .includes(state.filtros.busqueda.toLowerCase());
    const estaDisponible =
      !state.filtros.soloDisponibles ||
      (torneo.participantes < torneo.maxParticipantes &&
        torneo.estado === t("tournament.pending"));
    return coincideBusqueda && estaDisponible && torneo.ganador_id == null;
  });

  const isUserInTournament = useCallback(
    (torneo) => {
      if (!user || !torneo.participantes) return false;
      return torneo.participantes.some(
        (p) => p.id === user.id || p.user_id === user.id
      );
    },
    [user]
  );

  const manejarUnion = async (torneo) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (torneo.requiereContraseña) {
      setState((prev) => ({
        ...prev,
        torneoParaUnirse: torneo,
        modal: { ...prev.modal, password: true },
        passwordInput: "",
      }));
      return;
    }
    await confirmarUnion(torneo.id);
  };

  const confirmarUnion = async (torneoId, contrasena) => {
    try {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, action: true, torneoId },
      }));

      await tournamentApi.unirseATorneo(torneoId, contrasena);

      const actualizados = await tournamentApi.obtenerTorneosActivos();
      setState((prev) => ({
        ...prev,
        torneos: actualizados,
        modal: { ...prev.modal, password: false },
        loading: { ...prev.loading, action: false, torneoId: null },
        passwordInput: "",
        error: null,
      }));
      verDetalles(torneoId);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: { ...prev.loading, action: false, torneoId: null },
      }));
    }
  };
  const handleBackClick = () => navigate("/home");

  const manejarAbandono = async (torneoId) => {
    try {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, action: true, torneoId },
      }));
      await tournamentApi.abandonarTorneo(torneoId);

      const actualizados = await tournamentApi.obtenerTorneosActivos();
      setState((prev) => ({
        ...prev,
        torneos: actualizados,
        torneoSeleccionado: null,
        loading: { ...prev.loading, action: false, torneoId: null },
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: { ...prev.loading, action: false, torneoId: null },
      }));
    }
  };

  const manejarInicio = async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, action: true },
      }));

      await tournamentApi.iniciarTorneo(state.torneoSeleccionado.id);

      const [detalles, partidas] = await Promise.all([
        tournamentApi.obtenerDetallesTorneo(state.torneoSeleccionado.id),
        tournamentApi.obtenerPartidasTorneo(state.torneoSeleccionado.id),
      ]);

      setState((prev) => ({
        ...prev,
        torneoSeleccionado: {
          ...detalles,
          partidas: partidas,
          participanteActual: isUserInTournament(detalles),
        },
        loading: { ...prev.loading, action: false },
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: { ...prev.loading, action: false },
      }));
    }
  };

  const manejarCreacion = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, action: true },
        error: null,
      }));

      const nuevoTorneo = await tournamentApi.crearTorneo({
        nombre: state.form.nombre,
        descripcion: state.form.descripcion,
        premio: state.form.premio,
        contrasena: state.form.esPrivado ? state.form.contrasena : undefined,
      });

      setState((prev) => ({
        ...prev,
        torneos: [nuevoTorneo, ...prev.torneos],
        modal: { ...prev.modal, crear: false },
        form: {
          nombre: "",
          descripcion: "",
          premio: "",
          contrasena: "",
          esPrivado: false,
        },
        formErrors: {
          nombre: "",
          descripcion: "",
          premio: "",
          contrasena: "",
        },
        loading: { ...prev.loading, action: false },
      }));

      verDetalles(nuevoTorneo.id);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: { ...prev.loading, action: false },
      }));
    }
  };

  const verDetalles = async (torneoId) => {
    try {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, action: true, torneoId },
      }));
      const [detalles, partidas] = await Promise.all([
        tournamentApi.obtenerDetallesTorneo(torneoId),
        tournamentApi.obtenerPartidasTorneo(torneoId),
      ]);

      if (detalles.ganador_id) {
        setState((prev) => ({
          ...prev,
          torneoSeleccionado: null,
          loading: { ...prev.loading, action: false, torneoId: null },
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        torneoSeleccionado: {
          ...detalles,
          partidas: partidas,
          participanteActual: isUserInTournament(detalles),
        },
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
      }));
    } finally {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, action: false, torneoId: null },
      }));
    }
  };

  const organizeMatchesIntoRounds = (partidas, participantCount) => {
    const sortedMatches = [...(partidas || [])].sort(
      (a, b) => new Date(a.fecha) - new Date(b.fecha)
    );

    const rounds = { quarters: [], semis: [], final: [] };
    let remainingMatches = [...sortedMatches];

    if (participantCount >= 8) {
      rounds.quarters = remainingMatches.splice(0, 4);
    }

    if (participantCount >= 4) {
      const semiCount = participantCount >= 8 ? 2 : 2;
      rounds.semis = remainingMatches.splice(0, semiCount);
    }

    rounds.final = remainingMatches;

    return rounds;
  };

  const MatchesSection = ({ partidas, participantCount, participants }) => {
    const rounds = organizeMatchesIntoRounds(partidas, participantCount);

    if (!partidas || partidas.length === 0) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-indigo-700 rounded w-1/3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-indigo-700 rounded"></div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <>
        {rounds.quarters.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-bold text-yellow-300 mb-2 bg-indigo-900 p-2 rounded-t-lg flex items-center">
              <FaTrophy className="text-yellow-300 mr-2" />{" "}
              {t("tournament.quarters")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rounds.quarters.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  participants={participants}
                />
              ))}
            </div>
          </div>
        )}

        {rounds.semis.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-bold text-yellow-300 mb-2 bg-indigo-900 p-2 rounded-t-lg flex items-center">
              <FaMedal className="text-yellow-300 mr-2" />{" "}
              {t("tournament.semifinals")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rounds.semis.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  participants={participants}
                />
              ))}
            </div>
          </div>
        )}

        {rounds.final.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-bold text-yellow-300 mb-2 bg-indigo-900 p-2 rounded-t-lg flex items-center">
              <FaFire className="text-yellow-300 mr-2" />{" "}
              {t("tournament.final")}
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {rounds.final.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  participants={participants}
                />
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const MatchCard = ({ match, participants }) => {
    const findParticipant = (id) =>
      participants?.find((p) => p.id === id || p.user_id === id);

    const player1 = findParticipant(match.user1_id);
    const player2 = findParticipant(match.user2_id);
    const winner = findParticipant(match.ganador_id);

    const formatFecha = (fecha) => {
      if (!fecha) return "Fecha no definida";
      const date = new Date(fecha);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div className="bg-indigo-800 rounded-lg p-4 border-2 border-indigo-600 hover:border-yellow-400 transition-colors">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">
            {formatFecha(match.fecha)}
          </span>
          {winner && (
            <span className="text-xs bg-green-800 text-green-200 px-2 py-1 rounded-full">
              {t("tournament.final2")}
            </span>
          )}
        </div>
        <div className="flex items-center justify-around">
          <div
            className={`text-center p-2 rounded-lg ${
              winner?.id === player1?.id
                ? "bg-indigo-900 text-yellow-300"
                : "text-white"
            }`}
          >
            <p className="font-bold">{player1?.nombre || "Por definir"}</p>
            {player1 && (
              <span className="text-xs bg-indigo-700 px-2 py-1 rounded-full">
                Lv. {player1.nivel}
              </span>
            )}
          </div>
          <span className="mx-2 text-yellow-300 font-bold text-xl">VS</span>
          <div
            className={`text-center p-2 rounded-lg ${
              winner?.id === player2?.id
                ? "bg-indigo-900 text-yellow-300"
                : "text-white"
            }`}
          >
            <p className="font-bold">{player2?.nombre || "Por definir"}</p>
            {player2 && (
              <span className="text-xs bg-indigo-700 px-2 py-1 rounded-full">
                Lv. {player2.nivel}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CardTorneo = ({ torneo }) => {
    const esParticipante = isUserInTournament(torneo);
    const estaLleno = torneo.participantes >= torneo.maxParticipantes;
    const enCurso = torneo.estado === "en_curso";
    const isLoading =
      state.loading.action && state.loading.torneoId === torneo.id;

    return (
      <div className="bg-indigo-800 rounded-lg p-4 border-2 border-indigo-600 hover:border-yellow-300 transition-colors shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-yellow-300">{torneo.nombre}</h3>
          {torneo.requiereContraseña && <FaLock className="text-red-400" />}
        </div>
        <p className="text-indigo-200 text-sm mb-3 line-clamp-2">
          {torneo.descripcion}
        </p>

        <div className="flex justify-between text-sm mb-3">
          <span className="text-yellow-300 bg-indigo-900 px-2 py-1 rounded-full flex items-center">
            <FaUsers className="mr-1" />
            {torneo.participantes}/{torneo.maxParticipantes}
          </span>
          <span className="text-yellow-300 bg-indigo-900 px-2 py-1 rounded-full flex items-center">
            <FaCoins className="mr-1" />
            {torneo.premio}
          </span>
          <span
            className={`px-2 py-1 rounded-full flex items-center ${
              enCurso
                ? "bg-red-900 text-red-300"
                : "bg-green-900 text-green-300"
            }`}
          >
            {enCurso ? "En curso" : "Pendiente"}
          </span>
        </div>

        <button
          onClick={() =>
            esParticipante ? verDetalles(torneo.id) : manejarUnion(torneo)
          }
          className={`w-full py-2 rounded-full text-sm font-bold ${
            esParticipante
              ? "bg-blue-600 hover:bg-blue-700"
              : estaLleno || enCurso
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } text-white`}
          disabled={isLoading || estaLleno || enCurso}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin mx-auto" />
          ) : esParticipante ? (
            "Ver Detalles"
          ) : estaLleno ? (
            "Lleno"
          ) : enCurso ? (
            "En curso"
          ) : (
            "Unirse"
          )}
        </button>
      </div>
    );
  };

  if (state.loading.global) {
    return (
      <div
        className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <FaSpinner className="animate-spin text-4xl text-yellow-300" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div
        className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="text-center bg-indigo-900 bg-opacity-90 p-6 rounded-lg border-2 border-red-500">
          <h3 className="text-xl text-red-400 mb-4">Error</h3>
          <p className="text-indigo-200 mb-6">{state.error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/home")}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-full"
            >
              {t("tournament.back")}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full"
            >
              {t("tournament.retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-cover bg-center overflow-auto"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <BackButton
          onClick={() => navigate("/home")}
          className="absolute left-4 top-20"
        />

        <div className="bg-indigo-900 bg-opacity-90 rounded-xl p-6 border-2 border-indigo-700 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-yellow-300 flex items-center">
              <FaTrophy className="text-yellow-300 mr-2" />
              {state.torneoSeleccionado
                ? state.torneoSeleccionado.nombre
                : t("tournament.title")}
            </h1>

            {!state.torneoSeleccionado && (
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-grow">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" />
                  <input
                    type="text"
                    placeholder={t("tournament.pl5")}
                    className="w-full pl-10 pr-4 py-2 bg-indigo-800 text-white rounded-full border-2 border-indigo-600 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
                    value={state.filtros.busqueda}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        filtros: { ...prev.filtros, busqueda: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="soloDisponibles"
                    checked={state.filtros.soloDisponibles}
                    onChange={() =>
                      setState((prev) => ({
                        ...prev,
                        filtros: {
                          ...prev.filtros,
                          soloDisponibles: !prev.filtros.soloDisponibles,
                        },
                      }))
                    }
                    className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 rounded"
                  />
                  <label
                    htmlFor="soloDisponibles"
                    className="text-gray-300 text-sm"
                  >
                    {t("tournament.onlyAvailable")}
                  </label>
                </div>
                {user && (
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        modal: { ...prev.modal, crear: true },
                      }))
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white font-bold shadow-lg"
                    disabled={state.loading.action}
                  >
                    {state.loading.action ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <>
                        <FaPlus />
                        {t("tournament.create")}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {state.error && (
            <div className="mb-4 p-3 bg-red-600 bg-opacity-20 border-2 border-red-500 text-red-200 rounded-lg">
              {state.error}
            </div>
          )}

          {state.torneoSeleccionado && !state.torneoSeleccionado.ganador_id ? (
            <div className="bg-indigo-800 rounded-lg p-6 border-2 border-indigo-600 shadow-xl">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-indigo-700 p-4 rounded-lg border-2 border-indigo-600">
                  <h3 className="font-bold text-yellow-300 mb-3 flex items-center">
                    <FaCalendarAlt className="mr-2" /> {t("tournament.details")}
                  </h3>
                  <div className="text-indigo-100 space-y-2">
                    <p>
                      <span className="font-bold text-yellow-200">
                        {t("tournament.description")}
                      </span>{" "}
                      {state.torneoSeleccionado.descripcion}
                    </p>
                    <p>
                      <span className="font-bold text-yellow-200">
                        {t("tournament.status")}:
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-sm ${
                          state.torneoSeleccionado.estado === "en_curso"
                            ? "bg-red-900 text-red-300"
                            : "bg-green-900 text-green-300"
                        }`}
                      >
                        {state.torneoSeleccionado.estado === "en_curso"
                          ? t("tournament.inProgress")
                          : t("tournament.pending")}
                      </span>
                    </p>
                    <p>
                      <span className="font-bold text-yellow-200">
                        {" "}
                        {t("tournament.p1")}{" "}
                      </span>
                      <span className="ml-2 bg-yellow-900 text-yellow-300 px-2 py-1 rounded-full text-sm">
                        {state.torneoSeleccionado.premio}
                      </span>
                    </p>
                    <p>
                      <span className="font-bold text-yellow-200">
                        {t("tournament.participants")}
                      </span>
                      <span className="ml-2 bg-indigo-900 text-indigo-300 px-2 py-1 rounded-full text-sm">
                        {state.torneoSeleccionado.participantes?.length || 0}/
                        {state.torneoSeleccionado.maxParticipantes}
                      </span>
                    </p>
                    {state.torneoSeleccionado.estado === "en_curso" && (
                      <p>
                        <span className="font-bold text-yellow-200">
                          {t("tournament.start")}
                        </span>{" "}
                        {new Date(
                          state.torneoSeleccionado.fechaInicio
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-indigo-700 p-4 rounded-lg border-2 border-indigo-600">
                  <h3 className="font-bold text-yellow-300 mb-3 flex items-center">
                    <FaUsers className="mr-2" /> {t("tournament.players")}
                  </h3>
                  <div className="max-h-60 overflow-y-auto">
                    {state.torneoSeleccionado.participantes?.length > 0 ? (
                      state.torneoSeleccionado.participantes.map(
                        (jugador, index) => (
                          <div
                            key={jugador.id}
                            className="flex items-center gap-3 py-2 border-b border-indigo-500 last:border-0"
                          >
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden text-yellow-300 font-bold">
                              {jugador.avatar ? (
                                <img
                                  src={jugador.avatar}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>
                            <span
                              className={
                                jugador.id === user?.id ||
                                jugador.user_id === user?.id
                                  ? "text-yellow-300 font-bold"
                                  : "text-indigo-200"
                              }
                            >
                              {jugador.nombre || t("tournament.anoM")}
                            </span>
                            {(jugador.id === user?.id ||
                              jugador.user_id === user?.id) && (
                              <span className="ml-auto bg-blue-800 text-blue-200 px-2 py-1 rounded-full text-xs">
                                {t("tournament.you")}
                              </span>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-indigo-400">{t("tournament.info")}</p>
                    )}
                  </div>
                </div>
              </div>

              {state.torneoSeleccionado.estado === "en_curso" && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-yellow-300 mb-4 flex items-center">
                    <FaTrophy className="mr-2" />
                    {t("tournament.info2")}
                  </h3>

                  <MatchesSection
                    partidas={state.torneoSeleccionado.partidas}
                    participantCount={
                      state.torneoSeleccionado.participantes?.length || 0
                    }
                    participants={state.torneoSeleccionado.participantes || []}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                {state.torneoSeleccionado?.participanteActual && (
                  <button
                    onClick={() => manejarAbandono(state.torneoSeleccionado.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-white font-bold"
                    disabled={state.loading.action}
                  >
                    {state.loading.action ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <>
                        <FaSignOutAlt /> {t("tournament.leave")}
                      </>
                    )}
                  </button>
                )}

                {user &&
                  state.torneoSeleccionado &&
                  user.id === state.torneoSeleccionado.creadorId &&
                  !state.torneoSeleccionado.torneo_en_curso && (
                    <button
                      onClick={manejarInicio}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white font-bold"
                      disabled={
                        state.loading.action ||
                        state.torneoSeleccionado.participantes.length < 2
                      }
                      title={
                        state.torneoSeleccionado.participantes.length < 2
                          ? t("tournament.info3")
                          : ""
                      }
                    >
                      {state.loading.action ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <FaPlay /> {t("tournament.start")}
                        </>
                      )}
                    </button>
                  )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {torneosFiltrados.length > 0 ? (
                torneosFiltrados.map((torneo) => (
                  <CardTorneo key={torneo.id} torneo={torneo} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-indigo-400 mb-2">
                    {t("tournament.noTournaments")}
                  </p>
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        filtros: { ...prev.filtros, busqueda: "" },
                      }))
                    }
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    {t("tournament.clean")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de contraseña */}
      {state.modal.password && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-indigo-800 to-indigo-900 p-6 rounded-xl border-2 border-indigo-600 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-yellow-300">
                {t("tournament.privateTournament")}
              </h3>
              <button
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    modal: { ...prev.modal, password: false },
                    passwordInput: "",
                  }))
                }
                className="text-indigo-300 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <p className="text-indigo-300 mb-4">{t("tournament.passw")}</p>

            <input
              type="password"
              className="w-full px-4 py-3 bg-indigo-900/50 text-white rounded-lg border-2 border-indigo-600 focus:border-yellow-400"
              placeholder={t("tournament.pl4")}
              value={state.passwordInput}
              onChange={(e) =>
                setState((prev) => ({ ...prev, passwordInput: e.target.value }))
              }
              onKeyPress={(e) =>
                e.key === "Enter" &&
                state.passwordInput &&
                confirmarUnion(state.torneoParaUnirse.id, state.passwordInput)
              }
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    modal: { ...prev.modal, password: false },
                    passwordInput: "",
                  }))
                }
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-full text-white"
              >
                {t("tournament.cancel")}
              </button>
              <button
                onClick={() =>
                  confirmarUnion(state.torneoParaUnirse.id, state.passwordInput)
                }
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white"
                disabled={state.loading.action || !state.passwordInput}
              >
                {state.loading.action ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  t("tournament.confirm")
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de creación */}
      {state.modal.crear && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-indigo-800 to-indigo-900 p-6 rounded-xl border-2 border-indigo-600 shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-yellow-300 flex items-center gap-2">
                <FaTrophy /> {t("tournament.new")}
              </h3>
              <button
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    modal: { ...prev.modal, crear: false },
                    form: initialState.form,
                    formErrors: initialState.formErrors,
                  }))
                }
                className="text-indigo-300 hover:text-white p-1 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-indigo-300 mb-2 font-medium">
                  {t("tournament.name")}
                </label>
                <input
                  type="text"
                  name="nombre"
                  className={`w-full px-4 py-3 bg-indigo-900/50 text-white rounded-lg border-2 ${
                    state.formErrors.nombre
                      ? "border-red-500"
                      : "border-indigo-600 focus:border-yellow-400"
                  } focus:ring-0`}
                  value={state.form.nombre}
                  onChange={handleChange}
                  placeholder={t("tournament.pl3")}
                />
                {state.formErrors.nombre && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <FaExclamationTriangle /> {state.formErrors.nombre}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-indigo-300 mb-2 font-medium">
                  {t("tournament.description2")}
                </label>
                <textarea
                  name="descripcion"
                  className={`w-full px-4 py-3 bg-indigo-900/50 text-white rounded-lg border-2 ${
                    state.formErrors.descripcion
                      ? "border-red-500"
                      : "border-indigo-600 focus:border-yellow-400"
                  } focus:ring-0`}
                  rows="3"
                  value={state.form.descripcion}
                  onChange={handleChange}
                  placeholder={t("tournament.pl2")}
                />
                {state.formErrors.descripcion && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <FaExclamationTriangle /> {state.formErrors.descripcion}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-indigo-300 mb-2 font-medium">
                  {t("tournament.prize")}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400">
                    <FaCoins />
                  </span>
                  <input
                    type="text"
                    name="premio"
                    className={`w-full pl-10 pr-4 py-3 bg-indigo-900/50 text-white rounded-lg border-2 ${
                      state.formErrors.premio
                        ? "border-red-500"
                        : "border-indigo-600 focus:border-yellow-400"
                    } focus:ring-0`}
                    value={state.form.premio}
                    onChange={handleChange}
                    placeholder={t("tournament.pl1")}
                  />
                </div>
                {state.formErrors.premio && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <FaExclamationTriangle /> {state.formErrors.premio}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 bg-indigo-800/50 rounded-lg">
                <input
                  type="checkbox"
                  id="esPrivado"
                  name="esPrivado"
                  checked={state.form.esPrivado}
                  onChange={handleChange}
                  className="rounded text-yellow-400 focus:ring-yellow-400 h-5 w-5"
                />
                <label
                  htmlFor="esPrivado"
                  className="text-indigo-300 font-medium"
                >
                  {t("tournament.tp")}
                </label>
              </div>

              {state.form.esPrivado && (
                <div>
                  <label className="block text-indigo-300 mb-2 font-medium">
                    {t("tournament.pw")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      name="contrasena"
                      className={`w-full pl-10 pr-4 py-3 bg-indigo-900/50 text-white rounded-lg border-2 ${
                        state.formErrors.contrasena
                          ? "border-red-500"
                          : "border-indigo-600 focus:border-yellow-400"
                      } focus:ring-0`}
                      value={state.form.contrasena}
                      onChange={handleChange}
                      placeholder={t("tournament.pl4")}
                    />
                  </div>
                  {state.formErrors.contrasena && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <FaExclamationTriangle /> {state.formErrors.contrasena}
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={manejarCreacion}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg shadow-lg hover:shadow-green-500/30 transition-all mt-4 flex items-center justify-center gap-2"
                disabled={state.loading.action}
              >
                {state.loading.action ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <>
                    <FaPlus /> {t("tournament.createTournament")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Torneo;
