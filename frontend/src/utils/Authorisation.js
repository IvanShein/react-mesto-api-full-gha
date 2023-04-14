class Authorisation {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  };

  _handleServerResponse(response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(`При обращении к серверу возникла ошибка: ${response.status} ${response.statusText}`)
  };

  registration(password, email) {
    return fetch(`${this._baseUrl}/signup`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        "password": password,
        "email": email
          })
    })
      .then(this._handleServerResponse)
  };

  signIn(password, email) {
    return fetch(`${this._baseUrl}/signin`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        "password": password,
        "email": email
          })
    })
      .then(this._handleServerResponse)
  };

  checkToken(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(this._handleServerResponse)
  };

}

const authorisation = new Authorisation({
  baseUrl: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default authorisation;
