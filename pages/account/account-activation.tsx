import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link } from "components";
import { Layout } from "components/account";
import { userService, alertService } from "services";
import { useEffect, useState } from "react";

export default UserActivation;

function UserActivation() {
  const router = useRouter();
  const [isToken, setIsToken] = useState(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .min(6, "Confirm password must be at least 6 characters")
      .when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  useEffect(() => {
    if (router.query?.token) {
      userService
        .verifyToken(router.query.token)
        .then(() => {
          setIsToken(true);
        })
        .catch(alertService.error);
    } else {
      alertService.error(new Error("Token not found"), {});
      //router.push("/");
      setIsToken(false);
    }
  }, []);

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  type Props = {
    confirmPassword: string;
    password: string;
  };

  function onSubmit({ password }: Props) {
    return userService
      .accountActivation(router.query.token, password)
      .then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl || "/";
        router.push(returnUrl);
      })
      .catch(alertService.error);
  }

  return (
    <Layout>
      <section className="min-h-screen flex flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full ">
            <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600 text-center">
              User Activation
            </h1>

            <form
              className="mt-2 flex flex-col p-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label htmlFor="password" className="mt-6">
                Password
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

              <label htmlFor="confirmPassword" className="mt-6">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={`bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 form-control ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              <div className="text-red-500 text-xs italic">
                {errors.confirmPassword?.message}
              </div>

              <button
                disabled={formState.isSubmitting || !isToken}
                className="mt-10 text-lg text-white font-semibold bg-blue-500 py-3 px-6 rounded-md focus:outline-none focus:ring-2"
              >
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Submit
              </button>
              <div className="text-center">
                <a href="/account/login" className="hover:underline">
                  Login
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
