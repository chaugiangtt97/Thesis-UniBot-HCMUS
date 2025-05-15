# from setup import createApp
from setup_v2 import createApp

if __name__ == "__main__":
    try:
        app = createApp()
        app.run(debug=False,  host="0.0.0.0", port=5000)
    except Exception as e: 
        raise e