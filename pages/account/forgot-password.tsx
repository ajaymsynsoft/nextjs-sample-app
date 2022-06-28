import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { Link } from "components";
import { Layout } from "components/account";
import { userService, alertService } from "services";

export default ForgotPassword;

function ForgotPassword() {
  const router = useRouter();

  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  type Props = {
    email: string;
    password: string;
  };
  function onSubmit({ email }: Props) {
    return userService
      .forgotPassword(email)
      .then((response) => {
        // get return url from query parameters or default to '/'
        router.push(response.data["reset-password"]);
      })
      .catch(alertService.error);
  }

  return (
    <Layout>
      <section className="min-h-screen flex flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full ">
            <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600 text-center">
              Forgot Password
            </h1>

            <form
              className="mt-2 flex flex-col p-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="form-group mb-2">
                <label
                  htmlFor="email"
                  className="block text-gray-500 text-sm font-bold mb-2"
                >
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
              <button
                disabled={formState.isSubmitting}
                className="mt-10 text-lg text-white font-semibold bg-blue-500 py-3 px-6 rounded-md focus:outline-none focus:ring-2"
              >
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Submit
              </button>
              <div className="text-center">
                <a href="/account/login" className="hover:underline">
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
