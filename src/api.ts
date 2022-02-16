const ACCESS_TOKEN_MAP_BOX =
"pk.eyJ1Ijoic3RrZ2hvc3QiLCJhIjoiY2t6cHg3cmE1MG8yaDJvbmE4ZmQ5b2Q0dCJ9.lOXzkLIQ02JBm1s_m-L_ZQ";

export const fetchUserGithub = (login: string) =>
fetch(`https://api.github.com/users/${login}`).then(response => response.json()).then(data => data);

export const fetchLocalMapBox = (local: string) =>
fetch(
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${local}.json?access_token=${ACCESS_TOKEN_MAP_BOX}`
).then(response => response.json()).then(data => data);