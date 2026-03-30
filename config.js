// ecom.softifly
// export const apiBasePharma =
//   "https://webapps.acibd.com/api/pharma-ecommerce-app-stagging/api";
// export const imgBasePharma =
//   "https://webapps.acibd.com/api/barguna-pharma-app-stagging/storage";

// ousadbazar live
export const apiBasePharma =
  // "https://webapps.mis.digital/api/barguna-ecommerce/api";
  "http://192.168.101.151:3000/api";
export const imgBasePharma =
  "https://ecommerce-pharma.s3.ap-southeast-1.amazonaws.com";

export function formatNumber(number) {
  const isInteger = Number.isInteger(number);

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: isInteger ? 0 : 2,
  }).format(number);
}

export const getTokenConfig = () => {
  const token = localStorage.getItem("token" || "");

  return { headers: { Authorization: `Bearer ${token}` } };
};
