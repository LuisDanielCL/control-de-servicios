const formatDate = (fullDateString) => {
  if (fullDateString) {
    const date = new Date(fullDateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
}

export {
  formatDate
}
