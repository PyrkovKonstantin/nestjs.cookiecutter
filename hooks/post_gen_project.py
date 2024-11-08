#!/usr/bin/env python
import os
import shutil
import logging

# Set up logging

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    COMPONENTS_PATHS_FOR_DELETE = {
        "consumer": ("modules/amqp-broker"),
        "storage": ("modules/storage"),
        "db": ("config/db"),
        "mailer": ("config/mailer.config.ts"),
    }
    components_for_delete = set(COMPONENTS_PATHS_FOR_DELETE.keys()).difference('db,mailer'.split(','))

    logging.info(f"COMPONENTS: {{cookiecutter.components.split(',')}}")
    logging.info(f"components_for_delete: {components_for_delete}")

    for component in components_for_delete:
        logging.info(f"[COMPONENT]: {component}")
        logging.info(f"[COMPONENT]: {COMPONENTS_PATHS_FOR_DELETE[component]}")
        path = COMPONENTS_PATHS_FOR_DELETE[component]
        logging.info(f"[PATH]: {path}")
        if os.path.isdir(path):
            try:
                shutil.rmtree(path, ignore_errors=True)
                logging.info(f"Removed directory: {path}")
            except Exception as e:
                logging.error(f"Failed to remove directory: {path} - {e}")
        elif os.path.isfile(path):
            try:
                os.remove(path)
                logging.info(f"Removed file: {path}")
            except Exception as e:
                logging.error(f"Failed to remove file: {path} - {e}")