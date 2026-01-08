
const checkRequiredFields = (fields) => {
  return Object.entries(fields)
    .filter(([_, value]) => !value || value.toString().trim() === "")
    .map(([key]) => key);
};

export default checkRequiredFields;
