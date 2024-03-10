const storage = {
  set: (key: string, object: any) => {
    if (!localStorage) return;

    localStorage[key] =
      typeof object === "string" ? object : JSON.stringify(object);
  },
  get: (key: string) => {
    if (!localStorage || !localStorage[key]) return null;

    try {
      return JSON.parse(localStorage[key]);
    } catch (e) {
      return localStorage[key];
    }
  },
  remove: (key: string) => {
    if (!localStorage) return null;

    if (localStorage[key]) {
      localStorage.removeItem(key);
    }
  },
};

export default storage;
