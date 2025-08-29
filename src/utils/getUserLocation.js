import axios from "axios";

export async function getUserAddress() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const apiKey = import.meta.env.VITE_LOCATIONIQ_KEY;

          const response = await axios.get(
            `https://us1.locationiq.com/v1/reverse`,
            {
              params: {
                key: apiKey,
                lat: latitude,
                lon: longitude,
                format: "json",
              },
            }
          );

          // extract the readable address
          const address = response.data.display_name;
          console.log("📌 Human-readable address:", address); // ✅ log here
          resolve(address);
        } catch (error) {
          reject("Error fetching address: " + error.message);
        }
      },
      (error) => {
        reject("Error getting location: " + error.message);
      }
    );
  });
}
