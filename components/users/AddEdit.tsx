import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import moment from "moment";

import { userService, alertService } from "services";

export { AddEdit };

function AddEdit(props) {
  const user = props?.user;
  const preferances = props?.preferances;
  const isAddMode = !user;
  const router = useRouter();

  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required"),
    password: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      .concat(isAddMode ? Yup.string().required("Password is required") : null)
      .min(6, "Password must be at least 6 characters"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // set default form values if in edit mode
  if (!isAddMode) {
    props.user.preferences = props.user.preferences.map((x) => x.toString());
    props.user.dob =
      props.user.dob && moment(new Date(props.user.dob)).format("YYYY-MM-DD");
    formOptions.defaultValues = props.user;
  }

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState, control } =
    useForm(formOptions);
  const { errors } = formState;

  function onSubmit(data) {
    return isAddMode ? createUser(data) : updateUser(user.id, data);
  }

  function createUser(data) {
    return userService
      .register(data)
      .then(() => {
        alertService.success("User added", { keepAfterRouteChange: true });
        router.push(".");
      })
      .catch(alertService.error);
  }

  function updateUser(id, data) {
    return userService
      .update(id, data)
      .then(() => {
        alertService.success("User updated", { keepAfterRouteChange: true });
        router.push("..");
      })
      .catch(alertService.error);
  }

  return (
    <form className="mt-2 flex flex-col p-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <div className="form-group mb-2">
          <label className="block text-gray-500 text-sm font-bold mb-2">
            Name
          </label>
          <input
            name="name"
            type="text"
            {...register("name")}
            className={`bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 form-control ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          <div className="text-red-500 text-xs italic">
            {errors.name?.message}
          </div>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group mb-2">
          <label className="block text-gray-500 text-sm font-bold mb-2">
            Email
          </label>
          <input
            name="email"
            type="text"
            {...register("email")}
            className={`bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 form-control ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          <div className="text-red-500 text-xs italic">
            {errors.email?.message}
          </div>
        </div>
        <div className="form-group mb-2">
          <label>
            Password
            {!isAddMode && (
              <em className="ml-1">(Leave blank to keep the same password)</em>
            )}
          </label>
          <input
            name="password"
            type="password"
            {...register("password")}
            className={`bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 form-control ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          <div className="text-red-500 text-xs italic">
            {errors.password?.message}
          </div>
        </div>
        <div className="form-group mb-2">
          <label className="block text-gray-500 text-sm font-bold mb-2">
            Date of birth
          </label>
          <input
            name="dob"
            type="date"
            {...register("dob")}
            className={`bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 form-control ${
              errors.dob ? "border-red-500" : ""
            }`}
          />
          <div className="text-red-500 text-xs italic">
            {errors.dob?.message}
          </div>
        </div>
        <div className="form-group mb-2">
          <label className="block text-gray-500 text-sm font-bold mb-2">
            Preferances
          </label>
          {preferances.map((preferance, index) => {
            return (
              <>
                <div key={index} id={preferance.id}>
                  <div className="flex">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="preferences"
                        {...register("preferences")}
                        value={Number(preferance.id)}
                      />
                      <label
                        className="form-check-label inline-block text-gray-800"
                        for="inlineCheckbox1"
                      >
                        {preferance.preference}
                      </label>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>

      <div className="form-group">
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="mt-10 text-lg text-white font-semibold bg-blue-500 py-3 px-6 rounded-md focus:outline-none focus:ring-2"
        >
          {formState.isSubmitting && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          Save
        </button>
      </div>
    </form>
  );
}
