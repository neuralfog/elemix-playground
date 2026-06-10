package main

import (
	"net/http"
	"os"
	"strings"

	"github.com/brownhounds/swift"
)

func main() {
	host := getenv("HOST", "")
	port := getenv("PORT", "8091")
	staticDir := getenv("STATIC_DIR", "dist")

	app := swift.New()
	app.Handle("GET /", cacheControl(http.FileServer(http.Dir(staticDir))))
	app.Serve(host, port)
}

func cacheControl(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch path := r.URL.Path; {
		case strings.HasPrefix(path, "/assets/"), strings.HasPrefix(path, "/elemix/"):
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		default:
			w.Header().Set("Cache-Control", "no-cache")
		}
		next.ServeHTTP(w, r)
	})
}

func getenv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok {
		return v
	}
	return fallback
}
