from setup import createApp
from routes import initRoutes

if __name__ == "__main__":
    app = createApp()
    #initRoutes.preload()
    app.run(debug=False,  host="0.0.0.0", port=5000)
