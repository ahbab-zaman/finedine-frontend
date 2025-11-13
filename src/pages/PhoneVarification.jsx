import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { phoneVerificationSchema, otpSchema } from "../utils/validation";
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

const PhoneVerification = () => {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, isLoading } = useAuthStore();

  // Phone form
  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
    reset: resetPhone,
  } = useForm({
    resolver: yupResolver(phoneVerificationSchema),
  });

  // OTP form
  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: otpErrors },
    reset: resetOTP,
  } = useForm({
    resolver: yupResolver(otpSchema),
  });

  const onSubmitPhone = async (data) => {
    const fullPhone = data.countryCode + data.phoneNumber;
    console.log("Submitting phone:", fullPhone); // Debug: Check if handler runs
    setPhone(fullPhone);
    try {
      console.log("Calling sendOTP..."); // Debug
      await sendOTP(fullPhone);
      console.log("OTP sent successfully"); // Debug
      setStep(2);
      resetPhone();
    } catch (err) {
      console.error("Send OTP Error:", err); // Debug
      alert(`Failed to send OTP: ${err.message}`);
    }
  };

  const onSubmitOTP = async (data) => {
    console.log("Submitting OTP for phone:", phone); // Debug
    try {
      console.log("Calling verifyOTP..."); // Debug
      await verifyOTP(phone, data.otp);
      console.log("OTP verified successfully"); // Debug
      navigate("/register");
      resetOTP();
    } catch (err) {
      console.error("Verify OTP Error:", err); // Debug
      alert(`OTP Verification Failed: ${err.message}`);
    }
  };

  const handleBack = () => {
    setStep(1);
    setPhone("");
    resetPhone();
    resetOTP();
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {step === 1 ? "Verify Phone" : "Enter OTP"}
      </h2>
      {step === 1 ? (
        <form onSubmit={handleSubmitPhone(onSubmitPhone)} className="space-y-4">
          {" "}
          {/* FIXED: Added (onSubmitPhone) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Country Code
            </label>
            <select
              {...registerPhone("countryCode")}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Country</option>{" "}
              {/* Added default option */}
              {countryCodes.map((c, index) => (
                <option key={index} value={c.code}>
                  {c.code} ({c.name})
                </option>
              ))}
            </select>
            {phoneErrors.countryCode && (
              <p className="text-red-500 text-sm mt-1">
                {phoneErrors.countryCode.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              {...registerPhone("phoneNumber")}
              className="w-full p-2 border rounded-md"
              placeholder="Enter phone number"
            />
            {phoneErrors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {phoneErrors.phoneNumber.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">Sent to: {phone}</p>
          <form onSubmit={handleSubmitOTP(onSubmitOTP)} className="space-y-4">
            {" "}
            {/* FIXED: Added (onSubmitOTP) */}
            <div>
              <label className="block text-sm font-medium mb-1">OTP</label>
              <input
                type="text"
                {...registerOTP("otp")}
                className="w-full p-2 border rounded-md"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
              {otpErrors.otp && (
                <p className="text-red-500 text-sm mt-1">
                  {otpErrors.otp.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
          <button
            onClick={handleBack}
            className="w-full text-sm text-indigo-600 hover:text-indigo-500 mt-4"
            disabled={isLoading}
          >
            Back to Phone
          </button>
        </>
      )}
    </div>
  );
};

export default PhoneVerification;
