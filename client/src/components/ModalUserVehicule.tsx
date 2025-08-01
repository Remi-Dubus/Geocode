import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  BrandProps,
  ModelProps,
  SocketProps,
  UserVehiculeProps,
  VehiculeProps,
} from "../assets/definition/lib";
import car from "../assets/images/car-user.png";
import { useAuth } from "../context/userContext";
import ModalListVehicule from "./ModalListVehicule";

export default function ModalUserVehicule({
  closeModal,
}: { closeModal: () => void }) {
  const { userInfo } = useAuth();
  const id = userInfo;

  const { register, watch, handleSubmit } = useForm<VehiculeProps>();
  const [vehiculeInfo, setVehiculeInfo] = useState<UserVehiculeProps[]>();

  const [openBurgerMenu, setOpenBurgerMenu] = useState(false);
  const handleClickMenu = () => setOpenBurgerMenu(!openBurgerMenu);

  const [editVehicule, setEditVehicule] = useState(false);
  const [formVehicule, setFormVehicule] = useState(true);
  const [addVehicule, setAddVehicule] = useState(false);
  const handleClickEdit = () => {
    setFormVehicule(!formVehicule);
    setEditVehicule(!editVehicule);
    setOpenBurgerMenu(!openBurgerMenu);
  };

  const handleClickAdd = () => {
    setFormVehicule(!formVehicule);
    setAddVehicule(!addVehicule);
    setOpenBurgerMenu(!openBurgerMenu);
  };
  const [primaryCar, setPrimaryCar] = useState<number | undefined>();
  const [vehiculeId, setVehiculeId] = useState<number | undefined>(primaryCar);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/vehicule/user/${id}`)
      .then((res) => res.json())
      .then((data) => setPrimaryCar(data.id));
  }, [id]);

  const onSubmit: SubmitHandler<VehiculeProps> = async (dataVehicule) => {
    const carId = vehiculeId;
    const userVehiculeInfo = { ...dataVehicule, carId: carId };
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/vehicule/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userVehiculeInfo),
      },
    );

    if (response.status === 201) {
      const data = await response.json();
      toast.success(data.message);
      setEditVehicule(!editVehicule);
      setFormVehicule(!formVehicule);
    }
  };

  const onSubmitNewVehicule: SubmitHandler<VehiculeProps> = async (
    dataVehicule,
  ) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/vehicule/add/${id}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(dataVehicule),
      },
    );
    const data = await response.json();
    if (response.status === 201) {
      toast.success(data.message);
      setAddVehicule(!addVehicule);
      setFormVehicule(!formVehicule);
    } else {
      toast.warning(data.message);
    }
  };

  useEffect(() => {
    if (primaryCar !== undefined) {
      setVehiculeId(primaryCar);
    }
  }, [primaryCar]);

  useEffect(() => {
    if (vehiculeId !== undefined) {
      fetch(`${import.meta.env.VITE_API_URL}/api/vehicule`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          userMail: id,
          vehiculeId: vehiculeId,
        }),
      })
        .then((res) => res.json())
        .then((data) => setVehiculeInfo(data));
    }
  }, [vehiculeId, id]);

  const idBrand = watch("brand");
  const idSocket = watch("model");

  // Fetch brand from DB & stock them with state
  const [dataBrand, setDatabrand] = useState<BrandProps[]>([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data: BrandProps[]) => setDatabrand(data));
  }, []);

  // Fetch model from DB where model_id = brand(id) & stock model with state
  const [dataModel, setDataModel] = useState<ModelProps[]>();
  useEffect(() => {
    if (idBrand) {
      fetch(`${import.meta.env.VITE_API_URL}/api/register/${idBrand}`, {
        headers: { "Content-type": "application/json" },
      })
        .then((res) => res.json())
        .then((data: ModelProps[]) => setDataModel(data));
    }
  }, [idBrand]);

  // Fetch model from DB where socket_id = socket(id) & stock socket with state
  const [dataSocket, setDataSocket] = useState<SocketProps>();
  useEffect(() => {
    if (idSocket) {
      fetch(`${import.meta.env.VITE_API_URL}/api/register/socket/${idSocket}`, {
        headers: { "Content-type": "application/json" },
      })
        .then((res) => res.json())
        .then((data: SocketProps) => setDataSocket(data));
    }
  }, [idSocket]);

  const [showVehiculeList, setShowVehiculeList] = useState(false);
  const handleClikTableVehicules = () => {
    setShowVehiculeList(!showVehiculeList);
    setOpenBurgerMenu(!openBurgerMenu);
  };

  return (
    <>
      <button
        className="fixed inset-0 z-[990] backdrop-blur-sm"
        type="button"
        onClick={closeModal}
      />
      <section
        className={` overflow-hidden  h-[80vh] rounded-xl sm:pb-8 sm:w-4/6 sm:h-3/4 md:h-3/4 md:translate-x-1/4 lg:h-3/4 xl:top-auto xl:translate-x-8 xl:bottom-2 xl:h-3/4 2xl:w-1/4 xl:text-2xl ${
          vehiculeInfo ? "animate-closeModal" : "animate-openModal"
        } absolute bottom-0 bg-lightColor w-full z-[999]`}
      >
        <nav className=" w-[98vw] mx-auto flex justify-around  items-center gap-36  xl:w-[20vw] ">
          <button
            onClick={handleClickMenu}
            type="button"
            className="relative group "
          >
            <div className="ml-6 mt-4 relative flex overflow-hidden items-center justify-center rounded-2xl w-[50px] h-[50px]  bg-interestColor lg:h-24 lg:w-24 xl:w-[50px] xl:h-[50px] ">
              <div className="flex flex-col justify-between w-[20px] h-[20px]  origin-center overflow-hidden lg:w-12 xl:w-[20px] xl:h-[20px] ">
                <div
                  className={`bg-lightColor h-[2px] w-7 lg:w-12 xl:h-[2px] ${openBurgerMenu ? "transform transition-all duration-300 origin-left group-focus:rotate-[42deg]" : "transform transition-all duration-300 origin-left group-focus:rotate[42deg]"}  `}
                />
                <div
                  className={`bg-lightColor h-[2px] w-7 lg:w-12 xl:h-[2px] ${openBurgerMenu ? " rounded transform transition-all duration-300 group-focus:-translate-x-10 lg:group-focus:-translate-x-20 xl:group-focus:-translate-x-20" : "transform transition-all duration-300 group-focus:-translate-x10"} `}
                />
                <div
                  className={` bg-lightColor h-[2px] w-7 lg:w-12 xl:h-[2px] ${openBurgerMenu ? "transform transition-all duration-300 origin-left group-focus:-rotate-[42deg]" : "transform transition-all duration-300 origin-left group-focus:-rotate[42deg]"} `}
                />
              </div>
            </div>
          </button>
          {openBurgerMenu && (
            <ul
              className={`absolute top-[13vh] left-7 font-paragraph z-[1300]  mt-1 rounded-lg lg:text-3xl xl:text-xl ${openBurgerMenu ? "animate-openMenu" : "animate-closeMenu"} `}
            >
              <li className=" border border-lightColor bg-interestColor px-4 rounded-lg py-2 text-white hover:bg-interestColor active:bg-interestColor/50  focus:bg-interestColor/70">
                <button onClick={handleClickEdit} type="button">
                  Modifier un véhicule
                </button>
              </li>
              <li className="border border-lightColor  bg-interestColor px-4 rounded-lg py-2 text-white">
                <button onClick={handleClickAdd} type="button">
                  Ajouter un véhicule
                </button>
              </li>
              <li className="border border-lightColor  bg-interestColor px-4 rounded-lg py-2 text-white">
                <button onClick={handleClikTableVehicules} type="button">
                  Voir tous mes véhicules
                </button>
              </li>
            </ul>
          )}
          <figure className="w-24 bg-inherit border-8 border-white mx-auto  rounded-full  overflow-hidden-visible mt-4 bg-interestColor">
            <img className="relative bottom-4 " src={car} alt="vehicule" />
          </figure>
        </nav>
        <article className="w-5/6 mx-auto my-8  h-[30vh] xl:w-[20vw] ">
          <form
            onSubmit={
              addVehicule
                ? handleSubmit(onSubmitNewVehicule)
                : handleSubmit(onSubmit)
            }
            className="font-paragraph grid grid-cols-2  xl:w-80 xl:mx-auto xl:mt-20 xl:gap-8 "
          >
            <label
              htmlFor="brand"
              className="my-4 text-interestColor  text-xl xl:text-2xl"
            >
              Marque
            </label>
            <div className="relative top-5 xl:w-36">
              <input
                className="inline-block bg-inherit xl:w-40"
                type="text"
                readOnly={formVehicule}
                disabled={formVehicule}
                defaultValue={vehiculeInfo ? vehiculeInfo[0].brand : ""}
              />
              {!formVehicule && (
                <select
                  className="border  w-full rounded-md font-normal font-paragraph absolute top-0"
                  {...register("brand")}
                >
                  <option value={0}>Selectionnez un construteur</option>
                  {dataBrand
                    ? dataBrand.map((a) => (
                        <option value={a.id} key={a.label}>
                          {a.label}
                        </option>
                      ))
                    : "-"}
                </select>
              )}
            </div>
            <label
              htmlFor="model"
              className="my-4 text-interestColor text-xl xl:text-2xl"
            >
              Modèle
            </label>
            <div className="relative top-5 xl:w-36">
              <input
                className="inline-block bg-inherit xl:w-40 "
                type="text"
                readOnly={formVehicule}
                disabled={formVehicule}
                defaultValue={vehiculeInfo ? vehiculeInfo[0].model : ""}
              />
              {!formVehicule && (
                <select
                  className="border  w-full rounded-md font-normal font-paragraph absolute top-0"
                  {...register("model")}
                >
                  <option value={0}>Selectionnez un modèle</option>
                  {dataModel
                    ? dataModel.map((m) => (
                        <option value={m.socket_id} key={m.id}>
                          {m.label}
                        </option>
                      ))
                    : "-"}
                </select>
              )}
            </div>
            <label
              htmlFor="socket"
              className="my-4 text-interestColor text-xl xl:text-2xl "
            >
              Prise
            </label>
            <div className="relative top-5 xl:w-36">
              <input
                className="inline-block bg-inherit xl:w-40"
                type="text"
                readOnly={formVehicule}
                disabled={formVehicule}
                defaultValue={vehiculeInfo ? vehiculeInfo[0].socket : ""}
              />
              {!formVehicule && (
                <select
                  className="border  w-full rounded-md font-normal font-paragraph absolute top-0"
                  {...register("socket")}
                >
                  <option value={0}>Selectionnez un type de prise</option>
                  {dataSocket && (
                    <option value={dataSocket.id}>{dataSocket.label}</option>
                  )}
                </select>
              )}
            </div>
            {editVehicule && (
              <button
                className="border-interestColor w-fit mx-[14vh] border px-6 mt-2 rounded-3xl bg-interestColor text-white py-1 xl:relative xl:right-12 xl:top-4"
                type="submit"
              >
                Modifier
              </button>
            )}
            {addVehicule && (
              <button
                className="border-interestColor w-fit mx-[14vh] border px-6 mt-2 rounded-3xl bg-interestColor text-white py-1 xl:relative xl:right-12 xl:top-4"
                type="submit"
              >
                Ajouter
              </button>
            )}
          </form>
        </article>
      </section>

      {showVehiculeList &&
        createPortal(
          <ModalListVehicule
            setVehiculeId={(newVehiculeId) => setVehiculeId(newVehiculeId)}
            closeModal={() => setShowVehiculeList(!showVehiculeList)}
          />,
          document.body,
        )}
    </>
  );
}
