exports.notEmpty = (name) => {
  return (v) => {
    if (!v || v.trim === '') {
      return `${name} is required`;
    } else {
      return true;
    }
  };
};

exports.titleUpperCase = (str) => {
  newStr = str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
  return newStr;
}