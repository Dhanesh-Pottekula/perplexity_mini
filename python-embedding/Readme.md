| Mode | Command                                                                   | Notes                                         |
| ---- | ------------------------------------------------------------------------- | --------------------------------------------- |
| Dev  | `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`                    | Hot reload, single worker, for local dev      |
| Prod | `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app -b 0.0.0.0:8000` | Multiple workers, no reload, production-ready |
