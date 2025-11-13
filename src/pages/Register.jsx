import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../utils/validation";
import { useAuthStore } from "../store/useAuthStore";

const countryCodes = [
  { code: "+1", name: "USA" },
  { code: "+1", name: "Canada" }, // Shares +1 with USA
  { code: "+44", name: "UK" },
  { code: "+91", name: "India" },
  { code: "+81", name: "Japan" },
  { code: "+880", name: "Bangladesh" },
  { code: "+61", name: "Australia" },
  { code: "+49", name: "Germany" },
  // Add more as needed
];

const Register = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [phone, setPhone] = useState("");
  const { sendOTP, verifyOTP, register, isLoading } = useAuthStore();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmitForm = async (data) => {
    const fullPhone = data.countryCode + data.phoneNumber;
    setPhone(fullPhone);
    try {
      await sendOTP(fullPhone);
      setStep(2);
    } catch (err) {
      alert(err.message);
    }
  };

  const onSubmitOTP = async (data) => {
    try {
      const fullPhone = phone;
      await verifyOTP(fullPhone, data.otp);
      // After verification, register with full data (store form data in state if needed)
      // For simplicity, assume form data is re-submitted; in prod, persist it
      const formData = { ...data, phone: fullPhone }; // Adjust as needed
      await register(formData);
      alert("Registration successful!");
      reset();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register
          </h2>
        </div>
        {step === 1 ? (
          <form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit(onSubmitForm)}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                {...formRegister("name")}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                {...formRegister("email")}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                {...formRegister("password")}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="countryCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country Code
                </label>
                <select
                  {...formRegister("countryCode")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select</option>
                  {countryCodes.map((c, index) => (
                    <option key={index} value={c.code}>
                      {c.code} ({c.name})
                    </option>
                  ))}
                </select>
                {errors.countryCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.countryCode.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  {...formRegister("phoneNumber")}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmitOTP)}>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Enter OTP
              </label>
              <input
                {...formRegister("otp")}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.otp.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify & Register"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-indigo-600 hover:text-indigo-500"
            >
              Back to Form
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
