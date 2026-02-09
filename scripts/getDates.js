document.addEventListener('DOMContentLoaded', () => {
  // Get the current date
  const currentYear = new Date().getFullYear();
  // Get the documents last modified date
  const lastModDate = document.lastModified;

  // Get the currentYear element from html
  const currentYearElement = document.querySelector('.currentyear');
  // Get the lastModified element from html
  const lastModElement = document.querySelector('.lastModified');

  // update the html element with the data
  if (currentYearElement) {
    currentYearElement.innerHTML = `${currentYear}`;
  }
  // update the html element with the data
  if (lastModElement) {
    lastModElement.innerHTML = `Last modification:  ${lastModDate}`;
  }
});
