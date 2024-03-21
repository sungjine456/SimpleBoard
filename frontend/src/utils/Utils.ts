function dateToString(date: Date) {
  return new Date(date).toLocaleDateString("ko-KR");
}

export { dateToString };
