import logging
import os.path

import cherrypy
from cherrypy.lib.static import serve_file

__all__ = ["server_ui"]
logger = logging.getLogger("chaosplatform")
UI_DIR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "ui"))
INDEX_PATH = os.path.join(UI_DIR_PATH, "index.html")
STATIC_DIR_PATH = os.path.join(UI_DIR_PATH, "static")


class Dashboard:
    @cherrypy.expose
    def index(self):
        return serve_file(INDEX_PATH, "text/html")

    @cherrypy.expose
    def default(self, *args, **kwargs):
        return serve_file(INDEX_PATH, "text/html")


class StaticRoot:
    pass


def serve_ui(mount_path: str = "/dashboard", static_path: str = "/static"):
    """
    Serve the dashboard UI
    """
    logger.info("Serving UI")

    cherrypy.tree.mount(Dashboard(), mount_path)
    cherrypy.tree.mount(StaticRoot(), static_path, {
        "/": {
            "tools.staticdir.on": True,
            "tools.staticdir.index": "index.html",
            "tools.staticdir.dir": STATIC_DIR_PATH
        }
    })
