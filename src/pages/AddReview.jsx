import { useState } from "react";

const AddReview = () => {
  const [firstTime, setFirstTime] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [overallRating, setOverallRating] = useState(0);
  const [hygieneRating, setHygieneRating] = useState(0);
  const [tasteRating, setTasteRating] = useState(0);
  const [comeBack, setComeBack] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleStarClick = (rating, setter) => {
    setter(rating);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      firstTime,
      name,
      email,
      overallRating,
      hygieneRating,
      tasteRating,
      comeBack,
      termsAccepted,
    });
  };

  const Star = ({ filled, onClick }) => (
    <span
      className={`cursor-pointer text-xl transition-colors ${
        filled ? "text-pink-500 fill-current" : "text-gray-300"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      ★
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Please Give Us 60 Seconds!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Time Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Is this your first time at our restaurant?
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  firstTime === "yes"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFirstTime("yes")}
              >
                Yes
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  firstTime === "no"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFirstTime("no")}
              >
                No
              </button>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>

          {/* Overall Satisfaction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What is your overall satisfaction with our restaurant? *
            </label>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  filled={overallRating >= star}
                  onClick={() => handleStarClick(star, setOverallRating)}
                />
              ))}
            </div>
          </div>

          {/* Hygiene Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate the hygiene?
            </label>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  filled={hygieneRating >= star}
                  onClick={() => handleStarClick(star, setHygieneRating)}
                />
              ))}
            </div>
          </div>

          {/* Taste Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate the taste of our food?
            </label>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  filled={tasteRating >= star}
                  onClick={() => handleStarClick(star, setTasteRating)}
                />
              ))}
            </div>
          </div>

          {/* Come Back Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Would you come back to eat with us again?
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  comeBack === "yes"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setComeBack("yes")}
              >
                Yes
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  comeBack === "no"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setComeBack("no")}
              >
                No
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the terms and conditions *
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#C30C46] text-white py-3 px-4 rounded-md font-medium hover:bg-[#d61451] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReview;
