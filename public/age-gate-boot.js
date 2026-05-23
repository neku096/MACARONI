(() => {
  try {
    if (localStorage.getItem("ageConfirmed") === "true") {
      document.documentElement.classList.add("age-confirmed");
    }
  } catch (error) {
    document.documentElement.classList.remove("age-confirmed");
  }
})();
