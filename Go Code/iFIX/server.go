package main

import (
	"encoding/json"
	"fmt"
	//"net/http"
	"time"
	"iFIX/ifix/logger"

	"github.com/dgrijalva/jwt-go"
	"log"
	"net/http"
)
var jwtKey = []byte("secret_key")

var users = map[string]string{
	"user1": "password1",
	"user2": "password2",
}

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
 	DOY      int64  `json:"doy"`
 }
type response struct{
	Token string `json:"tokenn"`
}
type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func Login(w http.ResponseWriter, r *http.Request) {
if r.Method == "POST" {
	var credentials Credentials
	err := json.NewDecoder(r.Body).Decode(&credentials)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	expectedPassword, ok := users[credentials.Username]

	if !ok || expectedPassword != credentials.Password {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(time.Minute * 1)

	claims := &Claims{
		Username: credentials.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	 
    var tok response

		tok.Token=tokenString
    jsonResponse, jsonError := json.Marshal(tok)
    if jsonError != nil {
        logger.Log.Fatal("Internel Server Error")
    }


		w.Header().Set("Content-Type", "application/json")
    w.Write(jsonResponse)
}else {
		http.Error(w, "Method is not supported.", http.StatusNotFound)
		return
	}

}

func Home(w http.ResponseWriter, r *http.Request) {
//	cookie, err := r.Cookie("token")
if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)

		var t response
		err := decoder.Decode(&t)

		if err != nil {
			panic(err)
		}

	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	//tokenStr := cookie.Value

	claims := &Claims{}

	tkn, err := jwt.ParseWithClaims(t.Token, claims,
		func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !tkn.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.Write([]byte(fmt.Sprintf("Hello, %s", claims.Username)))
}else {
		http.Error(w, "Method is not supported.", http.StatusNotFound)
		return
	}

}

func Refresh(w http.ResponseWriter, r *http.Request){
	//cookie, err := r.Cookie("token")
if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)

		var t response//n by either opening a new connecti
		err := decoder.Decode(&t)

		if err != nil {
			panic(err)
		}

	/*if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}
*/
	//tokenStr := cookie.Value

	claims := &Claims{}

	tkn, err := jwt.ParseWithClaims(t.Token, claims,
		func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if !tkn.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// if time.Unix(claims.ExpiresAt, 0).Sub(time.Now()) > 30*time.Second {
	// 	w.WriteHeader(http.StatusBadRequest)
	// 	return
	// }

	expirationTime := time.Now().Add(time.Minute * 5)

	claims.ExpiresAt = expirationTime.Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	/*http.SetCookie(w,
		&http.Cookie{
			Name:    "refresh_token",
			Value:   tokenString,
			Expires: expirationTime,
		})*/
		var tok response

		tok.Token=tokenString
     jsonResponse, jsonError := json.Marshal(tok)
    if jsonError != nil {
        logger.Log.Fatal("Internel Server Error")

    }


		w.Header().Set("Content-Type", "application/json")
    w.Write(jsonResponse)
}else {
		http.Error(w, "Method is not supported.", http.StatusNotFound)
		return
	}

}

func main() {
	http.HandleFunc("/login", Login)
	http.HandleFunc("/home", Home)
	http.HandleFunc("/refresh", Refresh)

	log.Fatal(http.ListenAndServe(":8080", nil))
}