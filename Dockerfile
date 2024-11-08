FROM python:3.9-slim-buster

# Install some basic utilities
RUN apt-get update && apt-get install -y \
    git \
    tree \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get install -y tree

RUN useradd -ms /bin/bash user

USER user

WORKDIR /home/user

ENV PATH="$PATH:/home/user/.local/bin"

RUN pip install --user cookiecutter

WORKDIR /app/template

COPY . .

CMD ["tail", "-f", "/dev/null"]
