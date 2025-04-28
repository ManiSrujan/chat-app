const getApiDomain = (): Record<string, string> => {
  return {
    AUTH: "http://localhost:3001",
    CHAT: "http://localhost:3000",
  };
};

export default getApiDomain;
