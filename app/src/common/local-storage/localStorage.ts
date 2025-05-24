function setItem<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting item in localStorage: ${error}`);
  }
}

function getItem<T>(key: string): T | null {
  try {
    const serializedValue = localStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${error}`);
    return null;
  }
}

function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage: ${error}`);
  }
}

export { setItem, getItem, removeItem };
