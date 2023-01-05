package router

import (
	  "iFIX/ifix/logger"
	  	"github.com/dgrijalva/jwt-go"
"context"
"fmt"
	"iFIX/ifix/entities"
	"log"
	"net/http"
)

// NewRouter method is used to map with path and handler
func NewRouter() {
	for _, route := range routes {
		if route.Method == "POST"{
 
			if route.Pattern!="/loginnn"{
				 
				http.Handle("/api"+route.Pattern, TokenMiddleware(http.HandlerFunc(route.HandlerFunc),))
            }else{

        		http.Handle("/api"+route.Pattern, PostMiddleware(http.HandlerFunc(route.HandlerFunc),))

            }
		} else {
			http.Handle("/api"+route.Pattern, GetMiddleware(http.HandlerFunc(route.HandlerFunc)))
		}return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := strings.Split(r.Header.Get("Authorization"), "Bearer ")
		if len(authHeader) != 2 {
			fmt.Println("Malformed token")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Malformed Token"))
		} else {
			jwtToken := authHeader[1]
			token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
				}
				return []byte(SECRETKEY), nil
			})

			if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
				ctx := context.WithValue(r.Context(), "props", claims)
				// Access context values in handlers like this
				// props, _ := r.Context().Value("props").(jwt.MapClaims)
				next.ServeHTTP(w, r.WithContext(ctx))
			} else {
				fmt.Println(err)
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte("Unauthorized"))
			}
		}
	})
	}
}

// PostMiddleware method is used to handle post method. No other method will not applied
func PostMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		// POST method checking. No other method will be allowed within this function
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
		w.Header().Set("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization,Auth")
		w.Header().Set("Access-Control-Expose-Headers", "Autho")
		w.Header().Set("Cache-Control", "no-cache,no-store")
		if req.Method != "POST" {
			log.Println(req.Method + "is called in " + req.URL.Path)
			entities.ThrowJSONResponse(entities.NotPostMethodResponse(), w)
			return
		}
		next.ServeHTTP(w, req)
	})
}

// GetMiddleware method is used to handle post method. No other method will not applied
func GetMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		// POST method checking. No other method will be allowed within this function
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
		w.Header().Set("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization,Auth")
		w.Header().Set("Access-Control-Expose-Headers", "Autho")
		w.Header().Set("Cache-Control", "no-cache,no-store")
		if req.Method != "GET" {
			log.Println(req.Method + "is called in " + req.URL.Path)
			entities.ThrowJSONResponse(entities.NotPostMethodResponse(), w)
			return
		}
		next.ServeHTTP(w, req)
	})
}

func ThrowBlankResponse(w http.ResponseWriter, req *http.Request) {
	entities.ThrowJSONResponse(entities.BlankPathCheckResponse(), w)
}





func TokenMiddleware(next http.Handler) http.Handler{
	
return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := strings.Split(r.Header.Get("Authorization"), "Bearer ")
		if len(authHeader) != 2 {
			fmt.Println("Malformed token")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Malformed Token"))
		} else {
			jwtToken := authHeader[1]
			token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
				}
				return []byte("secret_key"), nil
			})

			if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
				ctx := context.WithValue(r.Context(), "props", claims)
				// Access context values in handlers like this
				// props, _ := r.Context().Value("props").(jwt.MapClaims)
				next.ServeHTTP(w, r.WithContext(ctx))
			} else {
				fmt.Println(err)
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte("Unauthorized"))
			}
		}
	})
}