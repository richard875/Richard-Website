const indexNowDoc = [
  { "HTTP Code": 200, Response: "OK", Reasons: "URL submitted successfully" },
  {
    "HTTP Code": 202,
    Response: "Accepted",
    Reasons: "URL received. IndexNow key validation pending",
  },
  { "HTTP Code": 400, Response: "Bad request", Reasons: "Invalid format" },
  {
    "HTTP Code": 403,
    Response: "Forbidden",
    Reasons:
      "In case of key not valid (e.g. key not found, file found but key not in the file)",
  },
  {
    "HTTP Code": 422,
    Response: "Unprocessable Entity",
    Reasons:
      "In case of URLs which don't belong to the host or the key is not matching the schema in the protocol",
  },
  {
    "HTTP Code": 429,
    Response: "Too Many Requests",
    Reasons: "Too Many Requests (potential Spam)",
  },
  {
    "HTTP Code": 800,
    Response: "API Endpoint Failed",
    Reasons:
      "Axios API call failed. This is most likely due to an issue with the API endpoint itself",
  },
];

export default indexNowDoc;
